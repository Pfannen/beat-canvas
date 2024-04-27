import { NoteDirection } from "@/lib/notes/types";
import { Coordinate } from "@/types";
import { BeamedNoteInfo } from "@/types/measurement";
import { TrigHelpers } from "@/utils/trig";
import { BeamGenerator } from "./beam-generator";

export type BeamNote = Coordinate & { beamCount: number };

export class NoteBeamCalculator {
  //*always want a note to "grow" and not shrink*
  static getPositionData(
    noteData: BeamNote[],
    direction: NoteDirection,
    angleTolerance: number
  ): BeamedNoteInfo[] {
    if (noteData.length < 2) {
      throw new Error("Cannot beam a single note");
    }
    const startNote = noteData[0];
    const endNote = noteData[noteData.length - 1];
    const ordered = this.notesAreOrdered(noteData);
    let beamData;
    if (!ordered) {
      beamData = this.calculateNonOrderedData(noteData);
    } else {
      beamData = TrigHelpers.calculateHypotenuseData(startNote, endNote);
    }
    let { angle, length } = beamData;
    const lowerBound = -angleTolerance;
    const upperBound = angleTolerance;

    if (angle < lowerBound) {
      angle = lowerBound;
      length = TrigHelpers.calculatePointHypotenuse(
        startNote,
        endNote,
        lowerBound
      );
    } else if (angle > upperBound) {
      angle = upperBound;
      length = TrigHelpers.calculatePointHypotenuse(
        startNote,
        endNote,
        upperBound
      );
    }

    const noteInfo = getBeamedNoteInfoArray(noteData.length);
    const isConflict = getOffsetConflictChecker(direction);
    const intersect = TrigHelpers.getYIntersection(angle, startNote, endNote);
    const offset = calculateOffset(intersect, endNote.y);
    if (isConflict(offset)) {
      noteInfo[0].stemOffset = Math.abs(offset);
    } else {
      noteInfo[noteInfo.length - 1].stemOffset = Math.abs(offset);
    }

    const point = adjustNoteYForOffset(
      startNote,
      noteInfo[0].stemOffset,
      direction
    );
    let maxConflictValue = 0;
    const intersectFn = TrigHelpers.getYIntersection.bind(null, angle, point);
    for (let i = 1; i < noteInfo.length - 1; i++) {
      const note = noteData[i];
      const intersection = intersectFn(note);
      const offset = calculateOffset(intersection, note.y);
      const absoluteOffset = Math.abs(offset);
      if (isConflict(offset)) {
        maxConflictValue = Math.max(maxConflictValue, absoluteOffset);
      }
      noteInfo[i].stemOffset = absoluteOffset;
    }

    if (maxConflictValue) {
      noteInfo[0].stemOffset += maxConflictValue;
      noteInfo[noteInfo.length - 1].stemOffset += maxConflictValue;
      const point = adjustNoteYForOffset(
        startNote,
        noteInfo[0].stemOffset,
        direction
      );
      const intersectFn = TrigHelpers.getYIntersection.bind(null, angle, point);
      for (let i = 1; i < noteInfo.length - 1; i++) {
        const note = noteData[i];
        const intersect = intersectFn(note);
        const offset = calculateOffset(intersect, note.y);
        noteInfo[i].stemOffset = Math.abs(offset);
      }
    }
    const addBeamToNote = (
      angle: number,
      length: number,
      beamNumber: number,
      index: number
    ) => {
      let beams = noteInfo[index].beams;
      if (!beams) {
        noteInfo[index].beams = [];
        beams = noteInfo[index].beams;
      }
      beams!.push({ angle, length, number: beamNumber });
    };
    noteInfo[0].beams = [{ angle, length, number: 0 }];
    const beamGenerator = new BeamGenerator(noteData, angle, addBeamToNote);
    beamGenerator.getExtraBeams();

    return noteInfo;
  }

  static notesAreOrdered(noteCoordinates: Coordinate[]) {
    if (noteCoordinates[0].y === noteCoordinates[1].y) return false;
    let isDecreasing = noteCoordinates[1].y < noteCoordinates[0].y;
    let prevY = noteCoordinates[1].y;
    for (let i = 2; i < noteCoordinates.length; i++) {
      const currY = noteCoordinates[i].y;
      if (isDecreasing) {
        if (prevY <= currY) return false;
      } else if (currY <= prevY) return false;
      prevY = currY;
    }
    return true;
  }

  static calculateNonOrderedData(notes: Coordinate[]) {
    const length = notes[notes.length - 1].x - notes[0].x;
    return { angle: 0, length };
  }
}

const adjustNoteYForOffset = (
  point: Coordinate,
  offset: number,
  direction: NoteDirection
) => {
  const newPoint = { ...point };
  if (direction === "up") {
    newPoint.y += offset;
  } else {
    newPoint.y -= offset;
  }
  return newPoint;
};

const getOffsetConflictChecker = (direction: NoteDirection) => {
  if (direction === "up") return (offset: number) => offset < 0;
  return (offset: number) => offset > 0;
};

const calculateOffset = (intersect: number, y: number) => intersect - y;

const getEmptyBeamedNoteInfo = (): BeamedNoteInfo => {
  return { stemOffset: 0 };
};

const getBeamedNoteInfoArray = (noteCount: number): BeamedNoteInfo[] => {
  const array: BeamedNoteInfo[] = [];
  for (let i = 0; i < noteCount; i++) {
    array.push(getEmptyBeamedNoteInfo());
  }
  return array;
};
