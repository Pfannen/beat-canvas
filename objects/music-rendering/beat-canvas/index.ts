import { Coordinate } from "@/objects/measurement/types";
import { DeepPartial } from "@/types";
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
  MeasureComponentContextIterator,
} from "@/types/music-rendering/canvas/beat-canvas";
import { RestPaths } from "./svg-paths";
import { NoteType } from "@/components/providers/music/types";

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

const getDrawOptions = () => {
  return tempDrawOptions;
};

export class BeatCanvas<T extends IDrawingCanvas = IDrawingCanvas>
  implements IBeatCanvas
{
  protected canvas: T;
  protected drawOptions: BeatCanvasDrawOptions;
  constructor(canvas: T, drawOptions?: DeepPartial<BeatCanvasDrawOptions>) {
    this.canvas = canvas;
    this.drawOptions = getDrawOptions();
    this.combineDrawOptions(drawOptions);
  }

  private combineDrawOptions(drawOptions?: DeepPartial<BeatCanvasDrawOptions>) {
    if (drawOptions?.note?.noteBodyAspectRatio) {
      this.drawOptions.note.noteBodyAspectRatio =
        drawOptions.note.noteBodyAspectRatio;
    }
  }

  protected static iterateMeasureLines(
    options: MeasureLinesOptions,
    del: MeasureComponentContextIterator
  ) {
    const { x, y } = options.topLeft;
    let currY = y;
    options.componentIterator((component) => {
      const height = component.isLine
        ? options.lineHeight
        : options.spaceHeight;
      const corner = { x, y: currY };
      del({ width: options.width, height, corner, ...component });
      currY -= height;
    });
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
    return { x: corner.x, y: corner.y + height };
  }

  protected drawMeasureLines(options: MeasureLinesOptions) {
    const iteratorDel: MeasureComponentContextIterator = (context) => {
      let color = "black";
      if (!context.isBody) {
        color = "lightgray";
      }
      if (context.isLine) {
        this.canvas.drawRectangle({
          corner: context.corner,
          width: context.width,
          height: -context.height,
          drawOptions: { color },
        });
      }
    };
    BeatCanvas.iterateMeasureLines(options, iteratorDel);
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
    const stemWidth = width * this.drawOptions.note.stemWidthBodyFraction;
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

  protected getRestData(type: NoteType) {
    const path =
      RestPaths[type] ||
      "M0.460198 0.981689c0.0661241 -0.231434 0.132248 -0.462869 0.198372 -0.694303 -0.165056 0.087233 -0.327569 0.0826551 -0.397508 0.00178026C0.23029 0.253815 0.213505 0.199135 0.222152 0.148016 0.235122 0.0719736 0.304552 -0.00788403 0.380849 0.000508647c0.0386572 0.0043235 0.068413 0.0175483 0.0902848 0.0384028 0.0429807 0.0409461 0.0447609 0.095117 0.0455239 0.116734 0.00152594 0.0508647 -0.0175483 0.0892675 -0.0282299 0.107325 0.0673957 -0.00737538 0.148271 -0.0289929 0.21058 -0.0897762 0.0569685 -0.0556968 0.0719736 -0.118006 0.0793489 -0.115463 0.0167854 0.00584944 -0.0798576 0.328586 -0.128688 0.492879 -0.0556968 0.187182 -0.100966 0.342065 -0.132248 0.449135 -0.0190743 -0.00610376 -0.0381485 -0.0122075 -0.0572228 -0.0183113z";
    const noteBodyFraction = 3;
    return { path, noteBodyFraction };
  }

  drawNote(options: NoteOptions) {
    this.drawNoteBody(options);
    const endOfStem = this.drawNoteStem(options);
    this.drawBeamData(options, endOfStem);

    return endOfStem;
  }

  drawMeasure(options: MeasureOptions): void {
    const { x, y } = options.topLeft;
    // const offsetY = y - options.containerPadding.top;
    this.drawMeasureLines({
      topLeft: { x, y: options.componentStartY },
      width: options.width,
      spaceHeight: options.spaceHeight,
      lineHeight: options.lineHeight,
      componentIterator: options.componentIterator,
      measureIndex: options.measureIndex,
    });
    const { endBarWidthLineFraction } = this.drawOptions.measure;
    const endBarWidth = options.lineHeight * endBarWidthLineFraction;
    const corner = {
      x: x + options.width - endBarWidth,
      y: options.bodyStartY,
    };
    this.canvas.drawRectangle({
      corner,
      height: -(options.bodyHeight - options.lineHeight / 2),
      width: endBarWidth,
    });
  }

  drawRest(options: RestOptions): void {
    const { path, noteBodyFraction } = this.getRestData(options.type);
    this.canvas.drawSVG({
      path,
      center: options.center,
      height: options.noteBodyHeight * noteBodyFraction,
    });
  }
}
