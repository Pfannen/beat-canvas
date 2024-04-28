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
  MeasureComponentContextIterator,
  MeasureData,
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
import { Measurements } from "@/objects/measurement/measurements";
import { CoordinateSectionArray } from "@/types/music-rendering/measure-manager/measure-outline";
import { MeasureSection, StaticMeasureAttributes } from "@/types/music";
import { getMeasureSectionDrawer } from "./drawers/measure-sections";
import { MeasureSectionDrawerArgs } from "@/types/music-rendering/canvas/beat-canvas/drawers/measure-section";
import { mergePartial } from "@/utils";

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
  protected drawOptions!: BeatCanvasDrawOptions;
  protected measurements: Measurements;
  protected measureComponentStartYOffset: number;
  protected measureComponentIterator;
  constructor(
    canvas: T,
    measurements: Measurements,
    drawOptions?: DeepPartial<BeatCanvasDrawOptions>,
    drawNonBodyComponents = false
  ) {
    this.canvas = canvas;
    this.createDrawOptions(drawOptions);
    this.measurements = measurements;
    this.measureComponentStartYOffset = drawNonBodyComponents
      ? this.measurements.getMeasureDimensions().padding.top
      : this.measurements.getBodyTopOffset();
    const measureComponents = this.measurements.getMeasureComponents();
    if (drawNonBodyComponents) {
      this.measureComponentIterator =
        measureComponents.iterateMeasureComponents.bind(measureComponents);
    } else {
      this.measureComponentIterator =
        measureComponents.iterateBodyComponents.bind(measureComponents);
    }
  }

  private createDrawOptions(drawOptions?: DeepPartial<BeatCanvasDrawOptions>) {
    this.drawOptions = getDrawOptions();
    mergePartial(this.drawOptions.note, drawOptions?.note);
    mergePartial(this.drawOptions.measure, drawOptions?.measure);
  }

  protected iterateMeasureLines(
    options: MeasureLinesOptions,
    del: MeasureComponentContextIterator
  ) {
    const { x, y } = options.topLeft;
    const { line, space } = this.measurements.getComponentHeights();
    let currY = y;
    this.measureComponentIterator((component) => {
      const height = component.isLine ? line : space;
      const corner = { x, y: currY };
      del({ width: options.totalWidth, height, corner, ...component });
      currY -= height;
    });
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
    this.iterateMeasureLines(options, iteratorDel);
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

  drawMeasure(options: MeasureData): void {
    let { x, y } = options.topLeft;
    this.drawMeasureLines({
      topLeft: { x, y: y - this.measureComponentStartYOffset },
      totalWidth: options.totalWidth,
      measureIndex: options.measureIndex,
    });
    const { endBarWidthLineFraction } = this.drawOptions.measure;
    const { line: lineHeight } = this.measurements.getComponentHeights();
    const endBarWidth = lineHeight * endBarWidthLineFraction;
    const bodyHeight = this.measurements.getBodyHeight();
    const bodyTopOffset = y - this.measurements.getBodyTopOffset();
    const bodyBottomY = bodyTopOffset - this.measurements.getBodyHeight();
    const corner = {
      x: x + options.totalWidth - endBarWidth,
      y: bodyBottomY,
    };
    this.canvas.drawRectangle({
      corner,
      height: bodyHeight - lineHeight / 2,
      width: endBarWidth,
    });
    const dimensions = this.measurements.getMeasureDimensions();
    this.drawMeasureSections(
      y - (dimensions.noteSpaceHeight + dimensions.padding.top),
      options.sections as any,
      options.sectionAttributes
    );

    // if (options.displayData) {
    //   const { displayData } = options;
    //   if (displayData.keySignature) {
    //     keySignatureDrawer({
    //       drawCanvas: this.canvas,
    //       symbol: displayData.keySignature.symbol,
    //       positions: displayData.keySignature.positions,
    //       symbolHeight: this.measurements.getComponentHeights().space * 2.5,
    //     });
    //   }
    // }
  }

  private yPosToAbsolute(measureBottomY: number, yPos: number) {
    return this.measurements.getYOffset(yPos) + measureBottomY;
  }

  protected drawMeasureSections(
    measureBottomY: number,
    sections: CoordinateSectionArray<Exclude<MeasureSection, "note">>,
    sectionAttributes: StaticMeasureAttributes
  ) {
    const yPosToAbsolute = this.yPosToAbsolute.bind(this, measureBottomY);

    sections.forEach((section) => {
      const drawer = getMeasureSectionDrawer(section.key);
      const data = sectionAttributes[section.key];
      const args: MeasureSectionDrawerArgs<typeof section.key> = {
        drawCanvas: this.canvas,
        bodyHeight: this.measurements.getBodyHeight(),
        componentHeights: this.measurements.getComponentHeights(),
        yPosToAbsolute,
        data,
        section,
      };
      if (drawer) {
        drawer(args as never);
      }
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
