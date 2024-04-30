import { Coordinate } from "@/types";
import { SVGData, ViewBox } from "@/types/svg";
import { TrigHelpers } from "../trig";

export function createRectanglePath(
  topLeft: Coordinate,
  topRight: Coordinate,
  bottomLeft: Coordinate,
  bottomRight: Coordinate
) {
  // Adjust y-coordinates to account for the origin at the bottom left
  const adjustedTopLeft = { x: topLeft.x, y: -topLeft.y };
  const adjustedTopRight = { x: topRight.x, y: -topRight.y };
  const adjustedBottomLeft = { x: bottomLeft.x, y: -bottomLeft.y };
  const adjustedBottomRight = { x: bottomRight.x, y: -bottomRight.y };

  const path = [
    `M ${adjustedTopLeft.x} ${adjustedTopLeft.y}`, // Move to adjusted top left corner
    `L ${adjustedTopRight.x} ${adjustedTopRight.y}`, // Line to adjusted top right corner
    `L ${adjustedBottomRight.x} ${adjustedBottomRight.y}`, // Line to adjusted bottom right corner
    `L ${adjustedBottomLeft.x} ${adjustedBottomLeft.y}`, // Line to adjusted bottom left corner
    "Z", // Close path by connecting back to adjusted top left corner
  ].join(" ");

  return path;
}

export function calculateRectangleViewBox(
  topLeft: Coordinate,
  topRight: Coordinate,
  bottomLeft: Coordinate,
  bottomRight: Coordinate
) {
  // Determine the minimum and maximum x and y coordinates
  const minX = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
  const minY = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
  const maxX = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
  const maxY = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);

  // Calculate the width and height of the viewBox
  const width = maxX - minX;
  const height = maxY - minY;

  const adjustedMinY = -maxY;

  // Construct the viewBox attribute value
  const viewBox: ViewBox = [minX, adjustedMinY, width, height];

  return viewBox;
}

export const createRotatedRectangleSVG = (
  pointOne: Coordinate,
  width: number,
  height: number,
  angle: number
) => {
  const pointTwo = TrigHelpers.calculateEndpoint(pointOne, angle, width);
  return createClippedRectanglSVG(pointOne, pointTwo, height);
};

export const createClippedRectanglSVG = (
  pointOne: Coordinate,
  pointTwo: Coordinate,
  height: number
): SVGData => {
  const bottomLeft = { x: pointOne.x, y: pointOne.y - height };
  const bottomRight = { x: pointTwo.x, y: pointTwo.y - height };
  const path = createRectanglePath(pointOne, pointTwo, bottomLeft, bottomRight);
  const viewBox = calculateRectangleViewBox(
    pointOne,
    pointTwo,
    bottomLeft,
    bottomRight
  );
  return { paths: [path], viewBox };
};
