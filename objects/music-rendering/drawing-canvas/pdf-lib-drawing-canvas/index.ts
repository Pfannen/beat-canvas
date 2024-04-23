import { IDrawingCanvas } from "@/types/music-rendering/canvas/drawing-canvas";
import { getSVGCenter } from "@/utils/svg";
import { PDFPage, degrees, rgb } from "pdf-lib";

type PDFLibGenerator<T extends keyof IDrawingCanvas> = (
  page: PDFPage
) => IDrawingCanvas[T];

export class PDFLibDrawingCanvas {
  public static getDrawingCanvas(page: PDFPage): IDrawingCanvas {
    return {
      drawRectangle: PDFLibDrawingCanvas.drawRectangleOnPage(page),
      drawEllipse: PDFLibDrawingCanvas.drawEllipseOnPage(page),
      drawSVG: PDFLibDrawingCanvas.drawSVGOnPage(page),
    };
  }

  private static drawRectangleOnPage: PDFLibGenerator<"drawRectangle"> = (
    page
  ) => {
    return (options) => {
      const { x, y } = options.corner;
      const rotation = options.drawOptions?.degreeRotation;
      page.drawRectangle({
        x,
        y,
        width: options.width,
        height: options.height,
        rotate: rotation ? degrees(-rotation) : undefined,
      });
    };
  };

  private static drawEllipseOnPage: PDFLibGenerator<"drawEllipse"> = (page) => {
    return (options) => {
      const { x, y } = options.center;
      const width = options.diameter * options.aspectRatio;
      const rotation = options.drawOptions?.degreeRotation;
      page.drawEllipse({
        x,
        y,
        xScale: width / 2,
        yScale: options.diameter / 2,
        rotate: rotation ? degrees(-rotation) : undefined,
      });
    };
  };

  private static drawSVGOnPage: PDFLibGenerator<"drawSVG"> = (page) => {
    return (options) => {
      const scale = options.scale || 1;
      let x = options.x;
      let y = options.y;
      if (options.center) {
        const { x: centerX, y: centerY } = centerToTopLeft(x, y, scale);
        const svgCenter = getSVGCenter(options.viewBox, scale);
        x = centerX + svgCenter.x;
        y = centerY + svgCenter.y;
      }
      page.drawSvgPath(options.path, {
        x,
        y,
        scale,
        color: rgb(0, 0, 0),
        rotate: degrees(options.drawOptions?.degreeRotation || 0),
      });
    };
  };
}

const centerToTopLeft = (x: number, y: number, scale: number) => {
  x -= scale / 2;
  y += scale / 2;
  return { x, y };
};
