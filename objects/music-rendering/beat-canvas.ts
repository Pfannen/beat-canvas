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

type BeatCanvasNoteDrawOptions = {
  noteBodyAspectRatio: number;
  noteBodyAngle: number;
  stemHeightBodyFraction: number;
  stemWidthBodyFraction: number;
};

type BeatCanvasMeasureDrawOptions = {
  endBarWidthLineFraction: number;
};

type BeatCanvasDrawOptions = {
  note: BeatCanvasNoteDrawOptions;
  measure: BeatCanvasMeasureDrawOptions;
};

const tempNoteDrawOptions: BeatCanvasNoteDrawOptions = {
  noteBodyAspectRatio: 1.5,
  noteBodyAngle: 15,
  stemHeightBodyFraction: 3,
  stemWidthBodyFraction: 0.15,
};

const tempMeasureDrawOptions: BeatCanvasMeasureDrawOptions = {
  endBarWidthLineFraction: 1.25,
};

const tempDrawOptions = {
  note: tempNoteDrawOptions,
  measure: tempMeasureDrawOptions,
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

  private drawMeasureLines(options: MeasureLinesOptions) {
    const { spaceCount, lineCount } = MeasureUtils.getComponentCountsBelow(
      options.aboveBelowComponentCount,
      options.aboveBelowComponentCount
    );
    const yOffset =
      spaceCount * options.spaceHeight + lineCount * options.lineHeight;

    const { x, y } = options.topLeft;
    const startY = y - yOffset;
    let currY = startY;
    for (let i = options.bodyCount; i > 0; i -= 2) {
      const corner = { x, y: currY };
      this.canvas.drawRectangle({
        corner,
        width: options.width,
        height: -options.lineHeight,
      });
      currY -= options.lineHeight + options.spaceHeight;
    }
    currY += options.spaceHeight + options.lineHeight / 2; //+options.lineHeight/2 to provide room for tolerence when drawing things at the start of the measure body
    return {
      bodyStartYPos: currY,
      bodyHeight: startY - currY,
    };
  }

  private drawBeamFlag(): void {}

  private drawNoteFlag(): void {}

  drawNote(options: NoteOptions): void {
    const { noteBodyAspectRatio } = this.drawOptions.note;
    const bodyWidth = noteBodyAspectRatio * options.bodyHeight;
    this.canvas.drawEllipse({
      center: options.bodyCenter,
      aspectRatio: noteBodyAspectRatio,
      diameter: options.bodyHeight,
      degreeRotation: this.drawOptions.note.noteBodyAngle,
    });
    const stemHeight =
      options.bodyHeight * this.drawOptions.note.stemHeightBodyFraction;
    const stemWidth =
      options.bodyHeight * this.drawOptions.note.stemWidthBodyFraction;
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
    const offsetY = y - options.containerPadding.top;
    const { bodyStartYPos, bodyHeight } = this.drawMeasureLines({
      ...options,
      topLeft: { x, y: offsetY },
    });
    const { endBarWidthLineFraction } = this.drawOptions.measure;
    const endBarWidth = options.lineHeight * endBarWidthLineFraction;
    const corner = { x: x + options.width - endBarWidth, y: bodyStartYPos };
    this.canvas.drawRectangle({
      corner,
      height: bodyHeight - options.lineHeight / 2,
      width: endBarWidth,
    });
  }

  drawRest(options: RestOptions): void {
    throw new Error("Method not implemented.");
  }
}
