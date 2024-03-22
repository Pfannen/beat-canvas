import { NoteDirection } from "@/lib/notes/types";
import {
  IBeatCanvas,
  IDrawingCanvas,
  MeasureOptions,
  NoteOptions,
  RestOptions,
} from "@/types/music-rendering/canvas";
import { Coordinate } from "../measurement/types";
import { MeasureUtils } from "../measurement/note-position";

type StemOptions = {
  bodyWidth: number;
  bodyCenter: Coordinate;
  stemWidth: number;
  stemHeight: number;
  direction: NoteDirection;
};

type MeasureLinesOptions = Pick<
  MeasureOptions,
  | "aboveBelowComponentCount"
  | "topLeft"
  | "lineHeight"
  | "spaceHeight"
  | "bodyCount"
  | "width"
>;

type BeatCanvasDrawOptions = {
  noteBodyAspectRatio: number;
  noteBodyAngle: number;
  stemHeightBodyFraction: number;
  stemWidthBodyFraction: number;
};

const tempDrawOptions: BeatCanvasDrawOptions = {
  noteBodyAspectRatio: 1.25,
  noteBodyAngle: -25,
  stemHeightBodyFraction: 3,
  stemWidthBodyFraction: 0.15,
};

export class BeatCanvas implements IBeatCanvas {
  private canvas: IDrawingCanvas;
  private drawOptions: BeatCanvasDrawOptions = tempDrawOptions;
  constructor(canvas: IDrawingCanvas) {
    this.canvas = canvas;
  }

  private drawStem(options: StemOptions): void {
    const widthRadius = options.bodyWidth / 2;
    let start: Coordinate;
    let end: Coordinate;
    if (options.direction === "up") {
      const x = options.bodyCenter.x + (widthRadius - options.stemWidth);
      const y = options.bodyCenter.y + options.stemHeight;
      start = { x, y: options.bodyCenter.y };
      end = { x, y };
    } else {
      const x = options.bodyCenter.x - widthRadius;
      const y = options.bodyCenter.y - options.stemHeight;
      start = { x, y };
      end = { x, y: options.bodyCenter.y };
    }
    this.canvas.drawLine({
      start,
      end,
      thickness: options.stemWidth,
    });
  }

  private drawMeasureLines(options: MeasureLinesOptions): void {
    const { spaceCount, lineCount } = MeasureUtils.getAboveBelowCounts(
      options.aboveBelowComponentCount
    );
    const yOffset =
      spaceCount * options.spaceHeight + lineCount * options.lineHeight;
    const { x, y } = options.topLeft;
    let currY = y + yOffset;
    for (let i = options.bodyCount; i > 0; i -= 2) {
      const start = { x, y: currY };
      const end = { x: x + options.width, y: currY };
      this.canvas.drawLine({ start, end, thickness: options.lineHeight });
      currY += options.lineHeight + options.spaceHeight;
    }
  }

  private drawBeamFlag(): void {}

  private drawNoteFlag(): void {}

  drawNote(options: NoteOptions): void {
    const { noteBodyAspectRatio } = this.drawOptions;
    const bodyWidth = noteBodyAspectRatio * options.bodyHeight;
    this.canvas.drawOval({
      center: options.bodyCenter,
      height: options.bodyHeight,
      aspectRatio: noteBodyAspectRatio,
      diameter: options.bodyHeight,
    });
    const stemHeight =
      options.bodyHeight * this.drawOptions.stemHeightBodyFraction;
    const stemWidth =
      options.bodyHeight * this.drawOptions.stemWidthBodyFraction;
    this.drawStem({
      bodyCenter: options.bodyCenter,
      stemHeight,
      stemWidth,
      bodyWidth,
      direction: options.direction,
    });

    throw new Error("Method not implemented.");
  }

  drawMeasure(options: MeasureOptions): void {
    const { x, y } = options.topLeft;
    const yOffset = y + options.containerPadding.top;
    this.drawMeasureLines({ ...options, topLeft: { x, y: yOffset } });
  }

  drawRest(options: RestOptions): void {
    throw new Error("Method not implemented.");
  }
}
