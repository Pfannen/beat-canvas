import { Coordinate } from "@/types";
import { DeepPartial } from "@/types";
import { IDrawingCanvas } from "@/types/music-rendering/canvas/drawing-canvas";
import {
  BeatCanvasNoteDrawOptions,
  BeatCanvasMeasureDrawOptions,
  IBeatCanvas,
  BeatCanvasDrawOptions,
  MeasureLinesOptions,
  BeamFlagOptions,
  NoteData,
  RestOptions,
  MeasureOptions,
  MeasureComponentContextIterator,
} from "@/types/music-rendering/canvas/beat-canvas";
import { NoteDirection } from "@/lib/notes/types";
import {
  annotationDrawers,
  createOffsetsObject,
} from "./drawers/note-annotations";
import { NoteAnnotationDrawerArgs } from "@/types/music-rendering/canvas/beat-canvas/drawers/note-annotations";
import { getRestDrawer } from "./drawers/measure-rests";
import { getFlagDrawer } from "./drawers/note-flags";
import { beamDrawer } from "./drawers/note-beams";

const tempNoteDrawOptions: BeatCanvasNoteDrawOptions = {
  noteBodyAspectRatio: 1.5,
  noteBodyAngle: -15,
  stemHeightBodyFraction: 3,
  stemWidthBodyFraction: 0.15,
  flagHeightBodyFraction: 0.5,
  annotationDistanceBodyFraction: 0.5,
  dotAnnotationAspectRatio: 1,
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
    if (drawOptions) {
      const { note } = drawOptions;
      if (note) {
        if (note.noteBodyAspectRatio) {
          this.drawOptions.note.noteBodyAspectRatio = note.noteBodyAspectRatio;
        }
        if (note.dotAnnotationAspectRatio) {
          this.drawOptions.note.dotAnnotationAspectRatio =
            note.dotAnnotationAspectRatio;
        }
      }
    }
  }

  protected static iterateMeasureLines(
    options: MeasureLinesOptions,
    del: MeasureComponentContextIterator
  ) {
    const { x, y } = options.topLeft;
    const { line, space } = options.componentHeights;
    let currY = y;
    options.componentIterator((component) => {
      const height = component.isLine ? line : space;
      const corner = { x, y: currY };
      del({ width: options.width, height, corner, ...component });
      currY -= height;
    });
  }

  // private drawStem(options: StemOptions) {
  //   const widthRadius = options.bodyWidth / 2;
  //   const { x, y } = options.bodyCenter;
  //   const corner = { x: x - widthRadius, y };
  //   let height = -options.stemHeight;
  //   let width = options.stemWidth;
  //   if (options.direction === "up") {
  //     corner.x = x + widthRadius;
  //     height *= -1;
  //     width *= -1;
  //   }
  //   this.canvas.drawRectangle({
  //     corner,
  //     width,
  //     height,
  //   });

  //   return { x: corner.x, y: corner.y + height };
  // }

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

  protected getNoteBodyWidth(bodyHeight: number) {
    const { noteBodyAspectRatio } = this.drawOptions.note;
    const width = noteBodyAspectRatio * bodyHeight;
    return width;
  }

  protected drawNoteBody(options: NoteData): void {
    this.canvas.drawEllipse({
      center: options.bodyCenter,
      aspectRatio: this.drawOptions.note.noteBodyAspectRatio,
      diameter: options.bodyHeight,
      drawOptions: { degreeRotation: this.drawOptions.note.noteBodyAngle },
    });
  }

  protected getStemWidth(bodyWidth: number) {
    return bodyWidth * this.drawOptions.note.stemWidthBodyFraction;
  }

  private getStemData(options: NoteData) {
    const { displayData } = options;
    const bodyWidth = this.getNoteBodyWidth(options.bodyHeight);
    const stemHeight =
      options.bodyHeight * this.drawOptions.note.stemHeightBodyFraction;
    const offsetHeight = Math.abs(displayData.stemOffset || 0);

    const widthRadius = bodyWidth / 2;
    const { x, y } = options.bodyCenter;
    let height = -(stemHeight + offsetHeight);
    const start = { x: x - widthRadius, y };
    let width = this.getStemWidth(bodyWidth);
    if (displayData.noteDirection === "up") {
      start.x = x + widthRadius;
      height *= -1;
      width *= -1;
    }

    return {
      start,
      end: { x: start.x, y: y + height },
      width,
      height,
      originalHeight: stemHeight,
    };
  }

  protected drawNoteStem(options: NoteData) {
    const stemData = this.getStemData(options);
    this.canvas.drawRectangle({
      corner: stemData.start,
      width: stemData.width,
      height: stemData.height,
    });
    const { displayData } = options;

    if (!displayData.beamInfo) {
      const flagDrawer = getFlagDrawer(options.type);
      if (flagDrawer) {
        flagDrawer({
          drawCanvas: this.canvas,
          endOfStem: stemData.end,
          noteDirection: displayData.noteDirection,
          stemHeight: stemData.originalHeight,
          stemWidth: Math.abs(stemData.width),
        });
      }
    } else {
      const beamHeight =
        options.bodyHeight * this.drawOptions.note.flagHeightBodyFraction;
      beamDrawer({
        drawCanvas: this.canvas,
        endOfStem: stemData.end,
        noteDirection: displayData.noteDirection,
        beamData: displayData.beamInfo,
        beamHeight,
        beamGap: beamHeight,
      });
    }

    return stemData.end;
  }

  protected drawBeamData(options: NoteData, endOfStem: Coordinate) {
    const { displayData } = options;
    if (displayData.beamInfo) {
      const { beamInfo } = displayData;
      if (beamInfo.beams) {
        const beam = beamInfo.beams[0];
        const height =
          options.bodyHeight * this.drawOptions.note.flagHeightBodyFraction;
        const width = beam.length;
        this.drawBeamFlag({
          corner: endOfStem,
          width,
          height: getAdjustedBeamHeight(height, displayData.noteDirection),
          angle: -beam.angle,
        });
      }
    }
  }

  private drawNoteAnnotations(noteData: NoteData) {
    const offsets = createOffsetsObject(
      noteData.bodyHeight,
      noteData.bodyHeight * this.drawOptions.note.noteBodyAspectRatio
    );
    noteData.annotations?.forEach((annotation) => {
      const drawer = annotationDrawers[annotation];
      if (drawer) {
        const args: NoteAnnotationDrawerArgs = {
          drawCanvas: this.canvas,
          noteData,
          noteDrawOptions: this.drawOptions.note,
          offsets,
        };
        drawer(args);
      }
    });
  }

  drawNote(options: NoteData) {
    this.drawNoteBody(options);
    const endOfStem = this.drawNoteStem(options);
    // this.drawBeamData(options, endOfStem);
    this.drawNoteAnnotations(options);
    return endOfStem;
  }

  drawMeasure(options: MeasureOptions): void {
    const { x, y } = options.topLeft;
    // const offsetY = y - options.containerPadding.top;
    this.drawMeasureLines({
      topLeft: { x, y: options.componentStartY },
      width: options.width,
      componentHeights: options.componentHeights,
      componentIterator: options.componentIterator,
      measureIndex: options.measureIndex,
    });
    const { endBarWidthLineFraction } = this.drawOptions.measure;
    const { line: lineHeight } = options.componentHeights;
    const endBarWidth = lineHeight * endBarWidthLineFraction;
    const corner = {
      x: x + options.width - endBarWidth,
      y: options.bodyStartY,
    };
    this.canvas.drawRectangle({
      corner,
      height: -(options.bodyHeight - lineHeight / 2),
      width: endBarWidth,
    });
  }

  drawRest(options: RestOptions): void {
    const drawer = getRestDrawer(options.type);
    if (drawer) {
      drawer({
        drawCanvas: this.canvas,
        restCenter: options.center,
        isDotted: false,
        measureComponentHeights: options.measureComponentHeights,
      });
    }
  }
}

const getAdjustedBeamHeight = (height: number, direction: NoteDirection) => {
  if (direction === "up") {
    return height;
  }
  return -height;
};
