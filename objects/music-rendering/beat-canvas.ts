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
  stemHeightBodyFraction: 1.75,
  stemWidthBodyFraction: 0.25,
};

export class BeatCanvas implements IBeatCanvas {
  private canvas: IDrawingCanvas;
  private drawOptions: BeatCanvasDrawOptions = tempDrawOptions;
  constructor(canvas: IDrawingCanvas) {
    this.canvas = canvas;
  }

  private drawStem(options: StemOptions): void {
    const widthRadius = options.bodyWidth / 2;
    const { x, y } = options.bodyCenter;
    const corner = { x: x - widthRadius, y };
    let height = -options.stemHeight;
    let width = options.stemWidth;
    if (options.direction === "up") {
      corner.x = x + widthRadius;
      height *= -1;
      width *= -1;
    }
    this.canvas.drawRectangle({
      corner,
      width,
      height,
    });
  }

  private drawMeasureLines(options: MeasureLinesOptions): void {
    const { spaceCount, lineCount } = MeasureUtils.getAboveBelowCounts(
      options.aboveBelowComponentCount
    );
    const yOffset =
      spaceCount * options.spaceHeight + lineCount * options.lineHeight;

    const { x, y } = options.topLeft;
    let currY = y - yOffset;
    for (let i = options.bodyCount; i > 0; i -= 2) {
      const corner = { x, y: currY };
      this.canvas.drawRectangle({
        corner,
        width: options.width,
        height: -options.lineHeight,
      });
      currY -= options.lineHeight + options.spaceHeight;
    }
  }

  private drawBeamFlag(): void {}

  private drawNoteFlag(): void {}

  drawNote(options: NoteOptions): void {
    const { noteBodyAspectRatio } = this.drawOptions;
    const bodyWidth = noteBodyAspectRatio * options.bodyHeight;
    this.canvas.drawEllipse({
      center: options.bodyCenter,
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
  }

  drawMeasure(options: MeasureOptions): void {
    const { x, y } = options.topLeft;
    const offsetY = y + options.containerPadding.top;
    this.drawMeasureLines({ ...options, topLeft: { x, y: offsetY } });
  }

  drawRest(options: RestOptions): void {
    throw new Error("Method not implemented.");
  }
}
