import { Coordinate } from "@/types";

export class TrigHelpers {
  static radiansToDegrees = (radians: number) => radians * (180 / Math.PI);

  static degreesToRadians = (degrees: number) => degrees * (Math.PI / 180);

  static getYIntersection = (
    angle: number,
    pointOne: Coordinate,
    pointTwo: Coordinate
  ) => {
    if (angle === 90) {
      return pointOne.y;
    }
    const m = Math.tan(TrigHelpers.degreesToRadians(angle));
    const b = pointOne.y - m * pointOne.x;
    const pointSlopeFormula = (x: number) => m * x + b;
    const yIntersect = pointSlopeFormula(pointTwo.x);
    return yIntersect;
  };

  static getSideLengths = (pointOne: Coordinate, pointTwo: Coordinate) => {
    const { x: x1, y: y1 } = pointOne;
    const { x: x2, y: y2 } = pointTwo;
    const xDistance = Math.abs(x1 - x2);
    const yDistance = Math.abs(y1 - y2);
    return { xDistance, yDistance };
  };

  static calculateSideHypotenuse = (sideOne: number, sideTwo: number) => {
    return Math.sqrt(Math.pow(sideOne, 2) + Math.pow(sideTwo, 2));
  };

  static calculatePointHypotenuse(
    pointOne: Coordinate,
    pointTwo: Coordinate,
    angle: number
  ) {
    const { xDistance } = TrigHelpers.getSideLengths(pointOne, pointTwo);
    const yDist = xDistance * Math.tan(TrigHelpers.degreesToRadians(angle));
    const length = TrigHelpers.calculateSideHypotenuse(xDistance, yDist);
    return length;
  }

  static calculateHypotenuseData(pointOne: Coordinate, pointTwo: Coordinate) {
    const { y: y1 } = pointOne;
    const { y: y2 } = pointTwo;
    const { xDistance, yDistance } = TrigHelpers.getSideLengths(
      pointOne,
      pointTwo
    );
    const length = TrigHelpers.calculateSideHypotenuse(xDistance, yDistance);
    const xyRatio = xDistance / yDistance;
    let angle = 0;
    if (y1 > y2) {
      angle = -TrigHelpers.radiansToDegrees(Math.atan(xyRatio));
    } else if (y1 < y2) {
      angle = TrigHelpers.radiansToDegrees(Math.atan(1 / xyRatio)); //yDistance / xDistance
    }
    return { length, angle };
  }

  static calculateEndpoint(
    point: Coordinate,
    angleDegrees: number,
    width: number
  ) {
    const radians = this.degreesToRadians(angleDegrees);
    // Calculate endpoint coordinates
    const endX = point.x + width * Math.cos(radians);
    const endY = point.y + width * Math.sin(radians);

    // Return the endpoint coordinates as an object
    return { x: endX, y: endY };
  }
}
