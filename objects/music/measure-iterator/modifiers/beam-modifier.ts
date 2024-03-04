import {
  Note,
  NoteRenderData,
  TimeSignature,
} from "@/components/providers/music/types";
import { getNoteDuration } from "@/components/providers/music/utils";
import Measurement, { BeamableNoteData } from "@/objects/measurement";
import { isBeamable } from "@/utils/music";

const attachBeamData = (
  measureNotes: NoteRenderData[],
  timeSignature: TimeSignature,
  subdivisionLength: number,
  measurement: Measurement
) => {
  let currentDivision = 0;
  let beamStack: BeamableNoteData[] = [];
  let startNoteIndex = 0;
  measureNotes.forEach((note, i) => {
    let processStack = true;
    let currNote: BeamableNoteData | undefined;
    if (isBeamable(note.type)) {
      const duration = getNoteDuration(note.type, timeSignature.beatNote);
      const { start, end } = noteStartEndDivisions(
        note.x,
        duration,
        subdivisionLength
      );
      if (start === end) {
        currNote = getBeamableNoteData(note, duration);
        if (beamStack.length === 0) {
          startNoteIndex = i;
          processStack = false;
          beamStack.push(currNote);
        } else {
          const prevNote = beamStack[beamStack.length - 1];
          const spaceBetween = note.x - (prevNote.x + prevNote.duration);
          if (spaceBetween === 0 && start === currentDivision) {
            beamStack.push(currNote);
            processStack = false;
          }
        }
      }
      currentDivision = start; //Will override as necessary
    }
    if (processStack) {
      let upCount = 0;
      beamStack.forEach(({ y }) => {
        if (measurement.getNoteDirection(y) === "up") upCount++;
      });
      const direction = beamStack.length / 2 < upCount ? "up" : "down";
      const data = measurement.getNoteBeamData(beamStack, direction);
      const firstNote = measureNotes[startNoteIndex];
      firstNote.beamData = { angle: data.beamAngle, length: data.beamLength };
      firstNote.stemOffset += data.noteOffsets[0];
      firstNote.noteDirection = direction;
      for (let i = 1; i < beamStack.length; i++) {
        const note = measureNotes[i + startNoteIndex];
        note.stemOffset += data.noteOffsets[i];
        note.noteDirection = direction;
      }
      beamStack = currNote ? [currNote] : [];
    }
  });
};

const getBeamableNoteData = (
  note: Note,
  duration: number
): BeamableNoteData => ({ x: note.x, y: note.y, duration });

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
  const end = Math.floor((x + duration) / subdivisionLength);
  return { start, end };
};
