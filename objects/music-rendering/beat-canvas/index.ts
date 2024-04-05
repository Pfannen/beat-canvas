import {
  IBeatCanvas,
  IDrawingCanvas,
  MeasureOptions,
  NoteOptions,
  RestOptions,
} from "@/types/music-rendering/canvas";
import {
  BeamFlagOptions,
  BeatCanvasDrawOptions,
  BeatCanvasMeasureDrawOptions,
  BeatCanvasNoteDrawOptions,
  MeasureLinesOptions,
  StemOptions,
} from "./types";
import { Coordinate } from "@/objects/measurement/types";

const tempNoteDrawOptions: BeatCanvasNoteDrawOptions = {
  noteBodyAspectRatio: 1.5,
  noteBodyAngle: -15,
  stemHeightBodyFraction: 3,
  stemWidthBodyFraction: 0.15,
  flagHeightBodyFraction: 0.5,
};

const tempMeasureDrawOptions: BeatCanvasMeasureDrawOptions = {
  endBarWidthLineFraction: 1.25,
};

const tempDrawOptions = {
  note: tempNoteDrawOptions,
  measure: tempMeasureDrawOptions,
};

type MeasureLineContext = {
  width: number;
  height: number;
  isLine: boolean;
  corner: Coordinate;
  isBody: boolean;
  absoluteYPos: number;
};

type MeasureLineIteratorDel = (context: MeasureLineContext) => void;

export class BeatCanvas implements IBeatCanvas {
  private canvas: IDrawingCanvas;
  private drawOptions: BeatCanvasDrawOptions = tempDrawOptions;
  constructor(canvas: IDrawingCanvas) {
    this.canvas = canvas;
  }

  private drawStem(options: StemOptions) {
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
    return { endOfStem: { x: corner.x, y: corner.y + height } };
  }

  private static iterateMeasureLines(
    options: MeasureLinesOptions,
    del: MeasureLineIteratorDel,
    iterateAboveBelow = false
  ) {
    const componentCount = options.lineCount + options.spaceCount;
    let isLine = options.topComponentIsLine;
    const { x, y } = options.topLeft;
    let currY = y;
    let bodyEndY = 0;
    let bodyStartY = 0;
    for (let yPos = componentCount; yPos > 0; yPos--) {
      const corner = { x, y: currY };
      const isBody = yPos >= options.bodyStartPos && yPos <= options.bodyEndPos;
      let height = options.spaceHeight;
      if (isLine) {
        height = options.lineHeight;
      }
      del({
        width: options.width,
        height,
        isBody,
        corner,
        isLine,
        absoluteYPos: yPos,
      });
      if (yPos === options.bodyStartPos) {
        bodyStartY = currY;
      } else if (yPos === options.bodyEndPos) {
        bodyEndY = currY;
      }
      isLine = !isLine;
      currY -= height;
    }
    return {
      bodyStartYPos: bodyStartY - options.lineHeight / 2,
      bodyHeight: bodyEndY - bodyStartY,
    };
  }

  private drawMeasureLines(options: MeasureLinesOptions) {
    const iteratorDel: MeasureLineIteratorDel = (context) => {
      if (context.isBody && context.isLine) {
        this.canvas.drawRectangle({
          corner: context.corner,
          width: context.width,
          height: -context.height,
        });
      }
    };
    return BeatCanvas.iterateMeasureLines(options, iteratorDel);
  }

  private drawBeamFlag(options: BeamFlagOptions): void {
    this.canvas.drawRectangle({
      corner: options.corner,
      height: options.height,
      width: options.width,
      degreeRotation: options.angle,
    });
  }

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
      options.bodyHeight * this.drawOptions.note.stemHeightBodyFraction +
      (options.stemOffset || 0);
    const stemWidth =
      options.bodyHeight * this.drawOptions.note.stemWidthBodyFraction;
    const { endOfStem } = this.drawStem({
      bodyCenter: options.bodyCenter,
      stemHeight,
      stemWidth,
      bodyWidth,
      direction: options.noteDirection,
    });
    if (options.beamData) {
      const { beamData } = options;
      const width =
        options.bodyHeight * this.drawOptions.note.flagHeightBodyFraction;
      const height = beamData.length;

      this.drawBeamFlag({
        corner: endOfStem,
        width,
        height,
        angle: beamData.angle,
      });
    }
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
