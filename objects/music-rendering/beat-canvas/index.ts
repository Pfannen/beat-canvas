import { Coordinate } from "@/objects/measurement/types";
import { IDrawingCanvas } from "@/types/music-rendering/canvas";
import {
  BeatCanvasNoteDrawOptions,
  BeatCanvasMeasureDrawOptions,
  IBeatCanvas,
  BeatCanvasDrawOptions,
  StemOptions,
  MeasureLinesOptions,
  BeamFlagOptions,
  NoteOptions,
  RestOptions,
  MeasureOptions,
  MeasureLineIteratorDel,
  MeasureAreaData,
  NoteAreaOptions,
} from "@/types/music-rendering/canvas/beat-canvas";

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

export class BeatCanvas<T extends IDrawingCanvas = IDrawingCanvas>
  implements IBeatCanvas
{
  protected canvas: T;
  protected drawOptions: BeatCanvasDrawOptions = tempDrawOptions;
  constructor(canvas: T) {
    this.canvas = canvas;
  }

  protected static iterateMeasureLines(
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

  protected static getMeasureContainerHeight(options: MeasureAreaData) {
    return (
      this.getMeasureNoteAreaHeight(options) +
      options.containerPadding.top +
      options.containerPadding.bottom
    );
  }

  protected static getMeasureNoteAreaHeight(
    options: Omit<MeasureAreaData, "containerPadding">
  ) {
    return (
      options.spaceCount * options.spaceHeight +
      options.lineCount * options.lineHeight
    );
  }

  protected static getNoteDimensions(options: NoteAreaOptions) {}

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
    return { x: corner.x, y: corner.y + height };
  }

  protected drawMeasureLines(options: MeasureLinesOptions) {
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
      drawOptions: { degreeRotation: options.angle },
    });
  }

  private drawNoteFlag(): void {}

  protected getNoteBodyWidth(bodyHeight: number) {
    const { noteBodyAspectRatio } = this.drawOptions.note;
    const width = noteBodyAspectRatio * bodyHeight;
    return width;
  }

  protected drawNoteBody(options: NoteOptions): void {
    this.canvas.drawEllipse({
      center: options.bodyCenter,
      aspectRatio: this.drawOptions.note.noteBodyAspectRatio,
      diameter: options.bodyHeight,
      drawOptions: { degreeRotation: this.drawOptions.note.noteBodyAngle },
    });
  }

  protected drawNoteStem(options: NoteOptions) {
    const width = this.getNoteBodyWidth(options.bodyHeight);
    const stemHeight =
      options.bodyHeight * this.drawOptions.note.stemHeightBodyFraction +
      Math.abs(options.stemOffset || 0);
    const stemWidth =
      options.bodyHeight * this.drawOptions.note.stemWidthBodyFraction;
    return this.drawStem({
      bodyCenter: options.bodyCenter,
      stemHeight,
      stemWidth,
      bodyWidth: width,
      direction: options.noteDirection,
    });
  }

  protected drawBeamData(options: NoteOptions, endOfStem: Coordinate) {
    if (options.beamData) {
      const { beamData } = options;
      const height =
        options.bodyHeight * this.drawOptions.note.flagHeightBodyFraction;
      const width = beamData.length;

      this.drawBeamFlag({
        corner: endOfStem,
        width,
        height,
        angle: beamData.angle - 90,
      });
    }
  }

  drawNote(options: NoteOptions) {
    this.drawNoteBody(options);
    const endOfStem = this.drawNoteStem(options);
    this.drawBeamData(options, endOfStem);

    return endOfStem;
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
