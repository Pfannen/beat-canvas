import { IDrawingCanvas } from "@/types/music-rendering/canvas/drawing-canvas";
import { PDFPage, degrees, rgb } from "pdf-lib";

type PDFLibGenerator<T extends keyof IDrawingCanvas> = (
  page: PDFPage
) => IDrawingCanvas[T];

export class PDFLibDrawingCanvas {
  public static getDrawingCanvas(page: PDFPage): IDrawingCanvas {
    return {
      drawLine: PDFLibDrawingCanvas.drawLineOnPage(page),
      drawRectangle: PDFLibDrawingCanvas.drawRectangleOnPage(page),
      drawCircle: PDFLibDrawingCanvas.drawCircleOnPage(page),
      drawEllipse: PDFLibDrawingCanvas.drawEllipseOnPage(page),
      drawSVG: PDFLibDrawingCanvas.drawSVGOnPage(page),
    };
  }

  private static drawLineOnPage: PDFLibGenerator<"drawLine"> = (page) => {
    return (options) => {
      page.drawLine(options);
    };
  };

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

  private static drawCircleOnPage: PDFLibGenerator<"drawCircle"> = (page) => {
    return (options) => {
      const { x, y } = options.center;
      page.drawCircle({ x, y, size: options.diameter / 2 });
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
      const scale = options.height || 1;
      const { x, y } = centerToTopLeft(
        options.center.x,
        options.center.y,
        scale
      );
      page.drawSvgPath(options.path, { x, y, scale, color: rgb(0, 0, 0) });
    };
  };
}

const centerToTopLeft = (x: number, y: number, scale: number) => {
  x -= scale / 2;
  y += scale / 2;
  return { x, y };
};
