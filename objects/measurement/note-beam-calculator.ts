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
    let { beamAngle, beamLength } = this.calculateEndpointData(
      startNote,
      endNote
    );
    const ordered = this.notesAreOrdered(noteCoordinates);
    if (!ordered) {
      return this.calculateNonOrderedData(noteCoordinates, direction);
    }
    const lowerBound = -angleTolerance;
    const upperBound = angleTolerance;

    let updatedBeamLength;
    if (beamAngle < lowerBound) {
      beamAngle = lowerBound;
      updatedBeamLength = this.calculateThresholdData(
        startNote,
        endNote,
        lowerBound
      );
    } else if (beamAngle > upperBound) {
      beamAngle = upperBound;
      updatedBeamLength = this.calculateThresholdData(
        startNote,
        endNote,
        upperBound
      );
    }

    const noteOffsets = new Array(noteCoordinates.length);
    noteOffsets[0] = 0;
    noteOffsets[noteOffsets.length - 1] = 0;
    const isConflict = getOffsetConflictChecker(direction);
    if (updatedBeamLength) {
      beamLength = updatedBeamLength;
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
      //Might have to denote the conflict values then update those differently
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
    const { xDistance, yDistance } = getSideLengths(pointOne, pointTwo);
    // let sideA;
    // let y1Offset = 0;
    // let y2Offset = 0;
    // if (pointOne.y > pointTwo.y) {
    //   const betaAngle = angle;
    //   // const alphaAngle = 90 - betaAngle;
    //   sideA = xDistance * Math.tan(degreesToRadians(betaAngle));
    //   y1Offset = sideA - yDistance;
    // } else {
    //   const alphaAngle = angle;
    //   sideA = xDistance * Math.tan(degreesToRadians(alphaAngle));
    //   y2Offset = sideA - yDistance;
    // }
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

  static calculateNonOrderedData(
    notes: Coordinate[],
    direction: NoteDirection
  ): BeamData {
    const reducer = direction === "up" ? greatestReducer : leastReducer;
    const significantY = notes.reduce(reducer).y;
    const noteOffsets = notes.map(({ y }) => Math.abs(y - significantY));
    const beamLength = notes[notes.length - 1].x - notes[0].x;
    return { beamAngle: 90, beamLength, noteOffsets };
  }
}

const greatestReducer = (greatest: Coordinate, current: Coordinate) => {
  return current.y > greatest.y ? current : greatest;
};

const leastReducer = (least: Coordinate, current: Coordinate) => {
  return current.y < least.y ? current : least;
};

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
