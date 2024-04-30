import { Coordinate } from "@/types";
import { DrawingCanvasTextPosition } from "@/types/music-rendering/canvas/drawing-canvas";
import { PDFFont } from "pdf-lib";

type PositionArgs = {
  x: number;
  y: number;
  text: string;
  font: PDFFont;
  size: number;
};

type PositionDel = (args: PositionArgs) => Coordinate;

//x and y are center coordinates. Create bottom left coordinates
const centerFont: PositionDel = (args) => {
  return {
    x: args.x - centerXFont(args.text, args.font, args.size),
    y: args.y - centerYFont(args.font, args.size),
  };
};

const topCenterFont: PositionDel = (args) => {
  return {
    x: args.x - centerXFont(args.text, args.font, args.size),
    y: args.y + centerYFont(args.font, args.size) * 2,
  };
};

const centerXFont = (text: string, font: PDFFont, size: number) => {
  return font.widthOfTextAtSize(text, size) / 2;
};

const centerYFont = (font: PDFFont, size: number) => {
  return font.heightAtSize(size) / 2;
};

const positionFunctions: Record<DrawingCanvasTextPosition, PositionDel> = {
  center: centerFont,
  topCenter: topCenterFont,
};

export const getPositionFunction = (position: DrawingCanvasTextPosition) =>
  positionFunctions[position];
