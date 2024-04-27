import { DisplayDataAttacher, NotePositionDel } from "./types";
import { NoteDirection } from "@/lib/notes/types";
import { NoteBeamCalculator } from "@/objects/measurement/note-beam/note-beam-calculator";
import { NoteDisplayData } from "@/types/music-rendering/draw-data/note";
import { BeamableNoteData } from "@/types/measurement";
import { getNoteBeamCount } from "@/utils/music";
import { getDecimalPortion } from "@/utils";
import { UnitConverters } from "@/types/music-rendering";

export type AttachBeamDataContext = {
  unitConverters: UnitConverters;
  getAbsolutePosition: NotePositionDel;
};

export const attachBeamData =
  (context: AttachBeamDataContext): DisplayDataAttacher =>
  ({ music, noteDisplayData, measureIndex }) => {
    const subdivisionLength = music.getMeasureSubdivisionLength(measureIndex);
    const noteCount = music.getMeasureNoteCount(measureIndex);
    let currentDivision = 0; // The current subdivision of the measure the notes in beamStack are in (dont want to beam notes across "segments")
    let beamStack: BeamableNoteData[] = []; // The notes that should be beamed together
    let startNoteIndex = 0; // The index of the first note in the beam stack
    for (let i = 0; i < noteCount; i++) {
      const note = music.getNoteData(measureIndex, i);
      let processStack = true; // If the notes in the beam stack should be beamed (this will be toggled if necessary)
      let currNote: BeamableNoteData | undefined; // The note to be pushed onto the beam stack (if undefined, no note should be pushed)
      const beamCount = getNoteBeamCount(note.type);
      if (beamCount) {
        const duration = music.getNoteDuration(measureIndex, i);
        const { start, end } = noteStartEndDivisions(
          note.x,
          duration,
          subdivisionLength
        );
        // If the note only belongs to one division
        if (start === end) {
          currNote = {
            x: note.x,
            y: note.y,
            noteIndex: i,
            beamCount,
            duration,
            stemOffset: noteDisplayData[i].stemOffset,
          };
          // If this is the first note to go on the beam stack
          if (beamStack.length === 0) {
            startNoteIndex = i;
            processStack = false;
            beamStack.push(currNote);
          } else {
            const prevNote = beamStack[beamStack.length - 1];
            const spaceBetween = note.x - (prevNote.x + prevNote.duration);
            //If there is no rest between the current note and the most recent note on the beam stack and this note is in the same division
            if (spaceBetween === 0 && start === currentDivision) {
              beamStack.push(currNote);
              processStack = false;
            }
          }
        }
        currentDivision = start; //Will override as necessary
      }
      // If process stack was set to true (the current note wasn't beamable or it was in a different division)
      if (processStack) {
        processBeamStack(
          noteDisplayData,
          startNoteIndex,
          beamStack,
          measureIndex,
          context.getAbsolutePosition,
          context.unitConverters
        );
        startNoteIndex = i;
        beamStack = currNote ? [currNote] : [];
      }
    }
    processBeamStack(
      noteDisplayData,
      startNoteIndex,
      beamStack,
      measureIndex,
      context.getAbsolutePosition,
      context.unitConverters
    );
  };

const processBeamStack = (
  noteData: NoteDisplayData[],
  startNoteIndex: number,
  beamStack: BeamableNoteData[],
  measureIndex: number,
  getAbsolutePosition: NotePositionDel,
  unitConverters: UnitConverters
) => {
  //If there is actually more than one note to beam
  if (beamStack.length > 1) {
    let upCount = 0;
    for (let i = 0; i < beamStack.length; i++) {
      if (noteData[i + startNoteIndex].noteDirection === "up") upCount++;
    }
    const direction = beamStack.length / 2 < upCount ? "up" : "down"; //All notes should be the same direction so this will make the direction whatever the most common direction was
    const beamData = getNoteBeamData(
      beamStack,
      direction,
      measureIndex,
      getAbsolutePosition,
      unitConverters
    );
    for (let i = 0; i < beamStack.length; i++) {
      const globalNoteIndex = i + startNoteIndex;
      const note = noteData[globalNoteIndex];
      const noteBeamData = beamData[i];

      const currentStemOffset = note.stemOffset || 0;
      note.stemOffset = currentStemOffset + noteBeamData.stemOffset;
      note.beamInfo = { beams: noteBeamData.beams, index: i };
      note.noteDirection = direction;
    }
  }
};

const noteStartEndDivisions = (
  x: number,
  duration: number,
  subdivisionLength: number
) => {
  const start = Math.floor(x / subdivisionLength);
  const endPoint = x + duration;
  let end = Math.floor(endPoint / subdivisionLength);
  if (getDecimalPortion(endPoint) === 0 && endPoint % subdivisionLength === 0)
    end--;

  return { start, end };
};

const getNoteBeamData = (
  notes: BeamableNoteData[],
  direction: NoteDirection,
  measureIndex: number,
  getAbsolutePosition: NotePositionDel,
  unitConverters: UnitConverters
) => {
  const coordinates = notes.map(({ noteIndex, stemOffset, beamCount }) => {
    let { x, y } = getAbsolutePosition(measureIndex, noteIndex);
    // const xPos =
    //   Measurements.getXFractionOffset(x, duration, beatsPerMeasure) *
    //   measureWidth;
    // const yPos = measurements.getYFractionOffset(y) * measureHeight;
    x = unitConverters.y(x);
    return { x, y, beamCount }; //Account for stemOffset later
  });
  const data = NoteBeamCalculator.getPositionData(coordinates, direction, 25);
  data.forEach((position) => {
    position.beams?.forEach((beam) => {
      beam.length = unitConverters.x(beam.length);
    });
  });
  return data;
};
