import { BeamableNoteData } from "@/objects/measurement";
import { isBeamable } from "../../../../../utils/music";
import { getDecimalPortion } from "../../../../../utils";
import { DisplayDataAttacher } from "./types";
import { NoteDirection } from "@/lib/notes/types";
import { Measurements } from "@/objects/measurement/measurements";
import { NoteBeamCalculator } from "@/objects/measurement/note-beam-calculator";
import { NoteDisplayData } from "@/types/music/draw-data";

export type AttachBeamDataContext = {
  measurements: Measurements;
  getMeasureDimensions: (measureIndex: number) => {
    height: number;
    width: number;
  };
};

export const attachBeamData =
  (context: AttachBeamDataContext): DisplayDataAttacher =>
  ({ music, noteDisplayData, measureIndex }) => {
    const { height, width } = context.getMeasureDimensions(measureIndex);
    const subdivisionLength = music.getMeasureSubdivisionLength(measureIndex);
    const { beatsPerMeasure } = music.getMeasureTimeSignature(measureIndex);
    const noteCount = music.getMeasureNoteCount(measureIndex);
    let currentDivision = 0; // The current subdivision of the measure the notes in beamStack are in (dont want to beam notes across "segments")
    let beamStack: BeamableNoteData[] = []; // The notes that should be beamed together
    let startNoteIndex = 0; // The index of the first note in the beam stack
    for (let i = 0; i < noteCount; i++) {
      const note = music.getNoteData(measureIndex, i);
      let processStack = true; // If the notes in the beam stack should be beamed (this will be toggled if necessary)
      let currNote: BeamableNoteData | undefined; // The note to be pushed onto the beam stack (if undefined, no note should be pushed)
      if (isBeamable(note.type)) {
        const duration = music.getNoteDuration(measureIndex, i);
        const { start, end } = noteStartEndDivisions(
          note.x,
          duration,
          subdivisionLength
        );
        // If the note only belongs to one division
        if (start === end) {
          currNote = {
            ...note,
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
          context.measurements,
          height,
          width,
          beatsPerMeasure
        );
        startNoteIndex = i;
        beamStack = currNote ? [currNote] : [];
      }
    }
    processBeamStack(
      noteDisplayData,
      startNoteIndex,
      beamStack,
      context.measurements,
      height,
      width,
      beatsPerMeasure
    );
  };

const processBeamStack = (
  noteData: NoteDisplayData[],
  startNoteIndex: number,
  beamStack: BeamableNoteData[],
  measurements: Measurements,
  measureHeight: number,
  measureWidth: number,
  beatsPerMeasure: number
) => {
  //If there is actually more than one note to beam
  if (beamStack.length > 1) {
    let upCount = 0;
    for (let i = 0; i < beamStack.length; i++) {
      if (noteData[i + startNoteIndex].noteDirection === "up") upCount++;
    }
    const direction = beamStack.length / 2 < upCount ? "up" : "down"; //All notes should be the same direction so this will make the direction whatever the most common direction was
    const data = getNoteBeamData(
      beamStack,
      direction,
      measurements,
      measureHeight,
      measureWidth,
      beatsPerMeasure
    );
    const firstNote = noteData[startNoteIndex];
    firstNote.beamData = { angle: data.beamAngle, length: data.beamLength }; //Give the first note in the stack the data
    for (let i = 0; i < beamStack.length; i++) {
      const note = noteData[i + startNoteIndex];
      if (data.noteOffsets[i]) {
        note.stemOffset = data.noteOffsets[i] + (note.stemOffset || 0); //Only attach this property if necessary
      }
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
  measurements: Measurements,
  measureHeight: number,
  measureWidth: number,
  beatsPerMeasure: number
) => {
  const coordinates = notes.map(({ x, y, duration, stemOffset }) => {
    const xPos =
      Measurements.getXFractionOffset(x, duration, beatsPerMeasure) *
      measureWidth;
    const yPos = measurements.getYFractionOffset(y) * measureHeight;

    return { x: xPos, y: yPos + (stemOffset || 0) };
  });
  return NoteBeamCalculator.getPositionData(coordinates, direction, 25);
};
