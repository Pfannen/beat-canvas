import {
  EllipseDrawOptions,
  IDrawingCanvas,
  RectangleDrawOptions,
  SVGDrawOptions,
  TextDrawOptions,
} from "@/types/music-rendering/canvas/drawing-canvas";
import { centerToTopLeft } from "@/utils/coordinate";
import { getSVGAspectRatio } from "@/utils/svg";
import { TrigHelpers } from "@/utils/trig";
import { ComponentProps, ReactNode } from "react";

type CanvasDrawAction = (ctx: CanvasRenderingContext2D, height: number) => void;

export class CanvasDrawingCanvas implements IDrawingCanvas {
  private canvasElement: ReactNode;
  private ctx!: CanvasRenderingContext2D;
  private height: number;
  private drawActions: CanvasDrawAction[] = [];
  constructor(props: ComponentProps<"canvas">, height: number) {
    this.canvasElement = (
      <canvas
        {...props}
        ref={(el) => {
          if (el) this.ctx = el.getContext("2d")!;
        }}
      />
    );
    this.height = height;
  }
  drawText(options: TextDrawOptions<{}>): void {
    throw new Error("Method not implemented.");
  }

  //   private addDrawAction(drawAction: CanvasDrawAction) {
  //     this.drawActions.push(drawAction);
  //   }

  drawRectangle(options: RectangleDrawOptions): void {
    // const drawAction: CanvasDrawAction = (ctx, height) => {
    let { x, y } = options.corner;
    y = this.height - y; // y = 0 is at the top of the canvas (for the draw canvas, y = 0 is a the bottom)
    this.ctx.fillStyle = options.drawOptions?.color || "black";
    this.ctx.fillRect(x, y, options.width, options.height);
    // };
    // this.addDrawAction(drawAction);
  }

  drawEllipse(options: EllipseDrawOptions): void {
    // const drawAction: CanvasDrawAction = (ctx, height) => {
    let { x, y } = options.center;
    y = this.height - y;
    const radiusY = options.diameter / 2;
    const radiusX = options.aspectRatio * radiusY;
    const rotation = TrigHelpers.degreesToRadians(
      options.drawOptions?.degreeRotation || 0
    );
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, radiusX, radiusY, rotation, 0, 2 * Math.PI);
    this.ctx.fillStyle = options.drawOptions?.color || "black";
    this.ctx.fill();
    this.ctx.closePath();
    // };
    // this.addDrawAction(drawAction);
  }
  drawSVG(options: SVGDrawOptions): void {
    const drawAction: CanvasDrawAction = (ctx, height) => {
      const heightScale = options.scale || 1;
      const widthScale = getSVGAspectRatio(options.viewBox) * heightScale;
      const path = new Path2D(); //options.path
      let { x, y } = centerToTopLeft(options.x, options.y, height, widthScale);
      y = this.height - y;
      ctx.scale(widthScale, heightScale);
      ctx.fillStyle = options.drawOptions?.color || "black";
      ctx.fill(path);
      ctx.translate(x, y);
      //   ctx.setTransform(1, 0, 0, 1, 0, 0);
    };
    this.drawActions.push(drawAction);
  }

  public getCanvas() {
    return this.canvasElement;
  }
}
