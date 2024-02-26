import { Coordinate } from "./types";

export class NoteBeamMeasurements {
  static getPositionData() {}
  static calculateEndpointData(pointOne: Coordinate, pointTwo: Coordinate) {
    const { x: x1, y: y1 } = pointOne;
    const { x: x2, y: y2 } = pointTwo;
    const xDistance = Math.abs(x1 - x2);
    const yDistance = Math.abs(y1 - y2);
    const beamLength = calculateHypotenuse(xDistance, yDistance);
    const xyRatio = xDistance / yDistance;
    let beamAngle = 90;
    if (y1 > y2) {
      beamAngle = radiansToDegrees(Math.atan(xyRatio));
    } else if (y1 < y2) {
      beamAngle = radiansToDegrees(Math.atan(1 / xyRatio)); //yDistance / xDistance
    }
    return { beamLength, beamAngle };
  }
}

const calculateHypotenuse = (sideOne: number, sideTwo: number) => {
  return Math.sqrt(Math.pow(sideOne, 2) + Math.pow(sideTwo, 2));
};

const radiansToDegrees = (radians: number) => radians * (180 / Math.PI);
