import { IDrawingCanvas } from "@/types/music-rendering/canvas";
import { PDFPage, degrees } from "pdf-lib";

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
      page.drawRectangle({
        x,
        y,
        width: options.width,
        height: options.height,
        rotate: options.degreeRotation
          ? degrees(-options.degreeRotation)
          : undefined,
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
      page.drawEllipse({
        x,
        y,
        xScale: width / 2,
        yScale: options.diameter / 2,
        rotate: options.degreeRotation
          ? degrees(-options.degreeRotation)
          : undefined,
      });
    };
  };

  private static drawSVGOnPage: PDFLibGenerator<"drawSVG"> = (page) => {
    return (options) => {};
  };
}
