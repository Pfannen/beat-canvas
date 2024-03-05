import {
  NoteRenderData,
  TimeSignature,
} from "@/components/providers/music/types";
import { getNoteDuration } from "../../../../components/providers/music/utils";
import Measurement, { BeamableNoteData } from "@/objects/measurement";
import { isBeamable } from "../../../../utils/music";
import { getDecimalPortion } from "../../../../utils";

export const attachBeamData = (
  measureNotes: NoteRenderData[],
  timeSignature: TimeSignature,
  subdivisionLength: number,
  measurement: Measurement
) => {
  let currentDivision = 0; // The current subdivision of the measure the notes in beamStack are in (dont want to beam notes across "segments")
  let beamStack: BeamableNoteData[] = []; // The notes that should be beamed together
  let startNoteIndex = 0; // The index of the first note in the beam stack
  measureNotes.forEach((note, i) => {
    let processStack = true; // If the notes in the beam stack should be beamed (this will be toggled if necessary)
    let currNote: BeamableNoteData | undefined; // The note to be pushed onto the beam stack (if undefined, no note should be pushed)
    if (isBeamable(note.type)) {
      const duration = getNoteDuration(note.type, timeSignature.beatNote);
      const { start, end } = noteStartEndDivisions(
        note.x,
        duration,
        subdivisionLength
      );
      // If the note only belongs to one division
      if (start === end) {
        currNote = getBeamableNoteData(note, duration);
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
      processBeamStack(measureNotes, startNoteIndex, beamStack, measurement);
      startNoteIndex = i;
      beamStack = currNote ? [currNote] : [];
    }
  });
  processBeamStack(measureNotes, startNoteIndex, beamStack, measurement);
};

const processBeamStack = (
  measureNotes: NoteRenderData[],
  startNoteIndex: number,
  beamStack: BeamableNoteData[],
  measurement: Measurement
) => {
  //If there is actually more than one note to beam
  if (beamStack.length > 1) {
    let upCount = 0;
    beamStack.forEach(({ y }) => {
      if (measurement.getNoteDirection(y) === "up") upCount++;
    });
    const direction = beamStack.length / 2 < upCount ? "up" : "down"; //All notes should be the same direction so this will make the direction whatever the most common direction was
    const data = measurement.getNoteBeamData(beamStack, direction);
    const firstNote = measureNotes[startNoteIndex];
    firstNote.beamData = { angle: data.beamAngle, length: data.beamLength }; //Give the first note in the stack the data
    for (let i = 0; i < beamStack.length; i++) {
      const note = measureNotes[i + startNoteIndex];
      note.stemOffset += data.noteOffsets[i];
      note.noteDirection = direction;
    }
  }
};

const getBeamableNoteData = (
  note: NoteRenderData,
  duration: number
): BeamableNoteData => ({
  x: note.x,
  y: note.y,
  duration,
  stemOffset: note.stemOffset,
});

const noteIsInDivision = (
  x: number,
  duration: number,
  subdivisionLength: number,
  currentSubdivision: number
) => {
  const { start, end } = noteStartEndDivisions(x, duration, subdivisionLength);
  if (start === end) return start === currentSubdivision;
  return false;
};

const noteCrossesDivisions = (
  x: number,
  duration: number,
  subdivisionLength: number
) => {
  const { start, end } = noteStartEndDivisions(x, duration, subdivisionLength);
  return start !== end;
};

const noteStartEndDivisions = (
  x: number,
  duration: number,
  subdivisionLength: number
) => {
  const start = Math.floor(x / subdivisionLength);
  const endPoint = x + duration;
  let end = Math.floor(endPoint / subdivisionLength);
  if (getDecimalPortion(endPoint) === 0) end--;
  return { start, end };
};
