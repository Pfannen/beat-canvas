import { NoteDirection } from "@/lib/notes/types";
import { BeamData, Coordinate } from "./types";

export class NoteBeamCalculator {
  //*always want a note to "grow" and not shrink*
  static getPositionData(
    noteCoordinates: Coordinate[],
    direction: NoteDirection,
    angleTolerance: number
  ): BeamData {
    if (noteCoordinates.length < 2) {
      throw new Error("Cannot beam a single note");
    }
    const startNote = noteCoordinates[0];
    const endNote = noteCoordinates[noteCoordinates.length - 1];
    const ordered = this.notesAreOrdered(noteCoordinates);
    let beamData;
    if (!ordered) {
      beamData = this.calculateNonOrderedData(noteCoordinates);
    } else {
      beamData = this.calculateEndpointData(startNote, endNote);
    }
    let { beamAngle, beamLength } = beamData;
    const lowerBound = -angleTolerance;
    const upperBound = angleTolerance;

    if (beamAngle < lowerBound) {
      beamAngle = lowerBound;
      beamLength = this.calculateThresholdData(startNote, endNote, lowerBound);
    } else if (beamAngle > upperBound) {
      beamAngle = upperBound;
      beamLength = this.calculateThresholdData(startNote, endNote, upperBound);
    }

    const noteOffsets = new Array(noteCoordinates.length);
    noteOffsets[0] = 0;
    noteOffsets[noteOffsets.length - 1] = 0;
    const isConflict = getOffsetConflictChecker(direction);
    const intersect = getYIntersection(
      { point: startNote, angle: beamAngle },
      endNote
    );
    const offset = calculateOffset(intersect, endNote.y);
    if (isConflict(offset)) {
      noteOffsets[0] = Math.abs(offset);
    } else {
      noteOffsets[noteOffsets.length - 1] = Math.abs(offset);
    }

    const point = { ...startNote };
    if (direction === "up") {
      point.y += noteOffsets[0];
    } else {
      point.y -= noteOffsets[0];
    }
    let maxConflictValue = 0;
    const intersectFn = getYIntersection.bind(null, {
      point,
      angle: beamAngle,
    });

    for (let i = 1; i < noteOffsets.length - 1; i++) {
      const note = noteCoordinates[i];
      const intersection = intersectFn(note);
      const offset = calculateOffset(intersection, note.y);
      const absoluteOffset = Math.abs(offset);
      if (isConflict(offset)) {
        maxConflictValue = Math.max(maxConflictValue, absoluteOffset);
      }
      noteOffsets[i] = absoluteOffset;
    }

    if (maxConflictValue) {
      noteOffsets[0] += maxConflictValue;
      noteOffsets[noteOffsets.length - 1] += maxConflictValue;
      for (let i = 1; i < noteOffsets.length - 1; i++) {
        const difference = maxConflictValue - noteOffsets[i];
        if (difference < 0) {
          noteOffsets[i] += maxConflictValue;
        } else {
          noteOffsets[i] = difference;
        }
      }
    }

    return {
      beamAngle,
      beamLength,
      noteOffsets,
    };
  }
  static calculateEndpointData(pointOne: Coordinate, pointTwo: Coordinate) {
    const { y: y1 } = pointOne;
    const { y: y2 } = pointTwo;
    const { xDistance, yDistance } = getSideLengths(pointOne, pointTwo);
    const beamLength = calculateHypotenuse(xDistance, yDistance);
    const xyRatio = xDistance / yDistance;
    let beamAngle = 0;
    if (y1 > y2) {
      beamAngle = -radiansToDegrees(Math.atan(xyRatio));
    } else if (y1 < y2) {
      beamAngle = radiansToDegrees(Math.atan(1 / xyRatio)); //yDistance / xDistance
    }
    return { beamLength, beamAngle };
  }

  static calculateThresholdData(
    pointOne: Coordinate,
    pointTwo: Coordinate,
    angle: number
  ) {
    const { xDistance } = getSideLengths(pointOne, pointTwo);
    const yDist = xDistance * Math.tan(degreesToRadians(angle));
    const beamLength = calculateHypotenuse(xDistance, yDist);
    return beamLength;
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
    const beamLength = notes[notes.length - 1].x - notes[0].x;
    return { beamAngle: 0, beamLength };
  }
}

const calculateHypotenuse = (sideOne: number, sideTwo: number) => {
  return Math.sqrt(Math.pow(sideOne, 2) + Math.pow(sideTwo, 2));
};

const getSideLengths = (pointOne: Coordinate, pointTwo: Coordinate) => {
  const { x: x1, y: y1 } = pointOne;
  const { x: x2, y: y2 } = pointTwo;
  const xDistance = Math.abs(x1 - x2);
  const yDistance = Math.abs(y1 - y2);
  return { xDistance, yDistance };
};

const radiansToDegrees = (radians: number) => radians * (180 / Math.PI);

const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180);

const getYIntersection = (
  beam: { point: Coordinate; angle: number },
  pointOne: Coordinate
) => {
  if (beam.angle === 90) {
    return beam.point.y;
  }
  const m = Math.tan(degreesToRadians(beam.angle));
  const b = beam.point.y - m * beam.point.x;
  const pointSlopeFormula = (x: number) => m * x + b;
  const yIntersect = pointSlopeFormula(pointOne.x);
  return yIntersect;
};

const getOffsetConflictChecker = (direction: NoteDirection) => {
  if (direction === "up") return (offset: number) => offset < 0;
  return (offset: number) => offset > 0;
};

const calculateOffset = (intersect: number, y: number) => intersect - y;
