import { StyleCreator } from ".";
import { DrawingCanvasTextPosition } from "@/types/music-rendering/canvas/drawing-canvas";
import { appendUnit } from "@/utils";

type PositionDel = (styleCreator: StyleCreator) => void;

const centerFont: PositionDel = (styleCreator) => {
  styleCreator.center();
};

const bottomCenterFont: PositionDel = (styleCreator) => {
  styleCreator.centerOnAxis("x");
};

const positionFunctions: Record<DrawingCanvasTextPosition, PositionDel> = {
  center: centerFont,
  bottomCenter: bottomCenterFont,
  bottomLeft: () => {},
};

export const appendPosition = (
  position: DrawingCanvasTextPosition,
  styleCreator: StyleCreator
) => {
  positionFunctions[position](styleCreator);
};
