import {
  EllipseDrawOptions,
  IDrawingCanvas,
  PDFFonts,
  RectangleDrawOptions,
  SVGDrawOptions,
  TextDrawOptions,
} from "@/types/music-rendering/canvas/drawing-canvas";
import { getSVGCenter, getSVGTopLeft } from "@/utils/svg";
import { Color, PDFPage, degrees, rgb } from "pdf-lib";
import { getPositionFunction } from "./utils";
import { remToPixel } from "@/utils";

export class PDFLibDrawingCanvas implements IDrawingCanvas {
  constructor(private page: PDFPage, private fonts?: PDFFonts) {
    if (!fonts) {
      this.drawText = () => {
        throw Error(
          "PDFLibDrawingCanvas: Can't Draw text without provided fonts"
        );
      };
    }
  }
  public drawRectangle(options: RectangleDrawOptions): void {
    const { x, y } = options.corner;
    const rotation = options.drawOptions?.degreeRotation;
    this.page.drawRectangle({
      x,
      y,
      width: options.width,
      height: options.height,
      rotate: rotation ? degrees(-rotation) : undefined,
    });
  }

  drawEllipse(options: EllipseDrawOptions): void {
    const { x, y } = options.center;
    const width = options.diameter * options.aspectRatio;
    const rotation = options.drawOptions?.degreeRotation;
    const color = getColor(options.drawOptions?.color);
    this.page.drawEllipse({
      x,
      y,
      xScale: width / 2,
      yScale: options.diameter / 2,
      rotate: rotation ? degrees(-rotation) : undefined,
      color,
    });
  }
  drawSVG(options: SVGDrawOptions): void {
    const scale = options.scale || 1;
    let x = options.x;
    let y = options.y;
    if (options.center) {
      const { x: centerX, y: centerY } = centerToTopLeft(x, y, scale);
      const svgCenter = getSVGCenter(options.viewBox, scale);
      x = centerX - svgCenter.x;
      y = centerY + svgCenter.y;
    } else {
      const topLeft = getSVGTopLeft(options.viewBox, scale);
      x -= topLeft.x;
      y += topLeft.y;
    }
    options.paths.forEach((path) => {
      this.page.drawSvgPath(path, {
        x,
        y,
        scale,
        color: rgb(0, 0, 0),
        rotate: degrees(options.drawOptions?.degreeRotation || 0),
      });
    });
  }
  drawText(options: TextDrawOptions): void {
    const fontRef = this.fonts![options.fontFamily];
    let { x, y } = options;
    if (options.position) {
      const positionFunction = getPositionFunction(options.position);
      const coordinates = positionFunction({
        x,
        y,
        text: options.text,
        font: fontRef,
        size: options.fontSize,
      });
      x = coordinates.x;
      y = coordinates.y;
    }
    if (options.fontUnit === "rem") {
      options.fontSize = remToPixel(options.fontSize);
    }
    this.page.drawText(options.text, {
      font: fontRef,
      size: options.fontSize,
      x,
      y,
    });
  }
}

const centerToTopLeft = (x: number, y: number, scale: number) => {
  x -= scale / 2;
  y += scale / 2;
  return { x, y };
};

const colorMap: Record<string, Color> = {
  black: rgb(0, 0, 0),
  white: rgb(1, 1, 1),
};

const getColor = (color?: string) => {
  if (!color) return colorMap["black"];
  return colorMap[color] || colorMap["black"];
};
