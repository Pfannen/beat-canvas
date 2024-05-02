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
  DynamicAttributeData,
} from "@/types/music-rendering/canvas/beat-canvas";
import { NoteDirection } from "@/lib/notes/types";
import {
  annotationDrawers,
  createOffsetsObject,
} from "./drawers/note/note-annotations";
import { NoteAnnotationDrawerArgs } from "@/types/music-rendering/canvas/beat-canvas/drawers/note/note-annotations";
import { getFlagDrawer } from "./drawers/note/note-flag";
import { beamDrawer } from "./drawers/note/note-beams";
import { Measurements } from "@/objects/measurement/measurements";
import { CoordinateSectionArray } from "@/types/music-rendering/measure-manager/measure-outline";
import { MeasureSection, MeasureSectionMetadata } from "@/types/music";
import { getMeasureSectionDrawer } from "./drawers/measure-sections";
import { MeasureSectionDrawerArgs } from "@/types/music-rendering/canvas/beat-canvas/drawers/measure/measure-section";
import { mergePartial } from "@/utils";
import { getNoteBodyDrawer } from "./drawers/note/note-body";
import { getRestDrawer } from "./drawers/measure/measure-rests";
import { getNoteStemDrawer, noteStemDrawer } from "./drawers/note/note-stem";
import { nonBodyDrawer } from "./drawers/note/non-body";
import { getDynamicAttributeDrawer } from "./drawers/measure/dynamic-attributes";
import { BlockDirection } from "@/types/music-rendering/pdf";

const getDrawOptions = () => {
  const tempNoteDrawOptions: BeatCanvasNoteDrawOptions = {
    noteBodyAspectRatio: 1.5,
    noteBodyAngle: -15,
    stemHeightBodyFraction: 3,
    stemWidthBodyFraction: 0.075,
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
      let opacity = 1;
      if (!context.isBody) {
        opacity = 0.05;
      }
      if (context.isLine) {
        this.canvas.drawRectangle({
          corner: context.corner,
          width: context.width,
          height: -context.height,
          drawOptions: { opacity },
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
    const offsetHeight = displayData.stemOffset || 0;

    return {
      bodyWidth,
      width: this.getStemWidth(bodyWidth),
      height: stemHeight + offsetHeight,
      originalHeight: stemHeight,
    };
  }

  protected drawNoteStem(options: NoteData) {
    const stemDrawer = getNoteStemDrawer(options.type); //If type === whole, no stem
    if (stemDrawer) {
      const stemData = this.getStemData(options);
      const endOfStem = noteStemDrawer({
        drawCanvas: this.canvas,
        stemHeight: stemData.height,
        stemWidth: stemData.width,
        bodyWidth: this.getNoteBodyWidth(options.bodyHeight),
        bodyCenter: options.bodyCenter,
        direction: options.displayData.noteDirection,
      });
      const { displayData } = options;
      if (displayData.nonBodyData) {
        const { nonBodyData } = displayData;
        nonBodyDrawer({
          drawCanvas: this.canvas,
          isOnLine: nonBodyData.isOnLine,
          lineCount: nonBodyData.numLines,
          measureHeights: this.measurements.getComponentHeights(),
          width: this.getNoteBodyWidth(options.bodyHeight) * 1.5,
          bodyCenter: options.bodyCenter,
          direction: options.displayData.noteDirection,
        });
      }
      if (!displayData.beamInfo) {
        const flagDrawer = getFlagDrawer(options.type);
        if (flagDrawer) {
          flagDrawer({
            drawCanvas: this.canvas,
            endOfStem,
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
          endOfStem,
          noteDirection: displayData.noteDirection,
          beamData: displayData.beamInfo,
          beamHeight,
          beamGap: beamHeight,
          stemWidth: stemData.width,
        });
      }
    }
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
    const { note } = this.drawOptions;
    const bodyDrawer = getNoteBodyDrawer(options.type);
    bodyDrawer({
      drawCanvas: this.canvas,
      center: options.bodyCenter,
      aspectRatio: note.noteBodyAspectRatio,
      bodyHeight: options.bodyHeight,
      bodyAngle: note.noteBodyAngle,
    });

    this.drawNoteStem(options);
    // this.drawBeamData(options, endOfStem);
    this.drawNoteAnnotations(options);
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
    const measureBottomY =
      y - (dimensions.noteSpaceHeight + dimensions.padding.top);
    this.drawMeasureSections(
      measureBottomY,
      options.sections as any,
      options.sectionAttributes
    );
    this.drawDynamicAttributes(
      measureBottomY,
      options.noteStartX,
      options.paddingValues,
      options.dynamicAttributes
    );
  }

  private yPosToAbsolute(measureBottomY: number, yPos: number) {
    return this.measurements.getYOffset(yPos) + measureBottomY;
  }

  protected drawDynamicAttributes(
    measureBottomY: number,
    noteStartX: number,
    paddingValues: BlockDirection<number>,
    dynamicAttributes?: DynamicAttributeData
  ) {
    if (dynamicAttributes) {
      const args = {
        drawCanvas: this.canvas,
        measureYValues: {
          top: this.yPosToAbsolute(
            measureBottomY,
            this.measurements.getAboveBelowCount() +
              this.measurements.getBodyCount() -
              1
          ),
          bottom: measureBottomY,
        },
        bodyHeight: this.measurements.getBodyHeight(),
        noteStartX,
        paddingValues,
      };
      dynamicAttributes.forEach(({ key, value }) => {
        const drawer = getDynamicAttributeDrawer(key, value);
        drawer(args);
      });
    }
  }

  protected drawMeasureSections(
    measureBottomY: number,
    sections: CoordinateSectionArray<Exclude<MeasureSection, "note">>,
    sectionAttributes: MeasureSectionMetadata
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
        clef: sectionAttributes["clef"],
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
        isDotted: options.isDotted,
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
