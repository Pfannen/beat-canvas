import { NoteDirection } from "@/lib/notes/types";
import { BeamData, Coordinate } from "./types";

export class NoteBeamCalculator {
  //*always want a note to "grow" and not shrink*
  static getPositionData(
    noteCoordinates: Coordinate[],
    direction: NoteDirection,
    angleTolerance: number
  ): BeamData {
    const startNote = noteCoordinates[0];
    const endNote = noteCoordinates[noteCoordinates.length - 1];
    let { beamAngle, beamLength } = this.calculateEndpointData(
      startNote,
      endNote
    );
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
    return {
      beamAngle,
      beamLength,
      noteOffsets: [startNoteOffset, endNoteOffset],
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
