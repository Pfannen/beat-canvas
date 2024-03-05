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
    const lowerBound = 90 - angleTolerance;
    const upperBound = 90 + angleTolerance;
    let thresholdData;
    if (beamAngle < lowerBound) {
      beamAngle = lowerBound;
      thresholdData = this.calculateThresholdData(
        startNote,
        endNote,
        lowerBound
      );
    } else if (beamAngle > upperBound) {
      beamAngle = upperBound;
      thresholdData = this.calculateThresholdData(
        startNote,
        endNote,
        upperBound
      );
    }
    let startNoteOffset = 0;
    let endNoteOffset = 0;
    if (thresholdData) {
      beamLength = thresholdData.beamLength;
      const { y1Offset, y2Offset } = thresholdData;

      //Only one offset will be present
      if (y1Offset) {
        //If the note staffs are pointing up and an endpoint's offset is negative, we don't want the note staff to shrink so we grow the other endpoint's staff
        if (y1Offset < 0 && direction === "up") {
          endNoteOffset = -y1Offset;
        } else {
          startNoteOffset = y1Offset;
        }
      } else {
        if (y2Offset < 0 && direction === "up") {
          startNoteOffset = -y2Offset;
        } else {
          endNoteOffset = y2Offset;
        }
      }
    }
    const intersectFn = getYIntersection.bind(null, {
      point: { ...startNote, y: startNote.y + startNoteOffset },
      angle: beamAngle,
    });
    const noteOffsets = [startNoteOffset];
    for (let i = 1; i < noteCoordinates.length - 1; i++) {
      const note = noteCoordinates[i];
      noteOffsets.push(Math.abs(note.y - intersectFn(note)));
    }
    noteOffsets.push(endNoteOffset);
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
    let beamAngle = 90;
    if (y1 > y2) {
      beamAngle = 180 - radiansToDegrees(Math.atan(xyRatio));
    } else if (y1 < y2) {
      beamAngle = 90 - radiansToDegrees(Math.atan(1 / xyRatio)); //yDistance / xDistance
    }
    return { beamLength, beamAngle };
  }

  static calculateThresholdData(
    pointOne: Coordinate,
    pointTwo: Coordinate,
    angle: number
  ) {
    const { xDistance, yDistance } = getSideLengths(pointOne, pointTwo);
    let sideA;
    let y1Offset = 0;
    let y2Offset = 0;
    if (pointOne.y > pointTwo.y) {
      const betaAngle = 180 - angle;
      const alphaAngle = 90 - betaAngle;
      sideA = xDistance * Math.tan(degreesToRadians(alphaAngle));
      y1Offset = sideA - yDistance;
    } else {
      const alphaAngle = 90 - angle;
      sideA = xDistance * Math.tan(degreesToRadians(alphaAngle));
      y2Offset = sideA - yDistance;
    }
    const beamLength = calculateHypotenuse(xDistance, sideA);
    return { beamLength, y1Offset, y2Offset };
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
