"use client";

import { BeatCanvas } from "..";
import { ReactDrawingCanvas } from "../../drawing-canvas/react-drawing-canvas";
import {
  BeatCanvasDrawOptions,
  MeasureComponentContextIterator,
  MeasureLinesOptions,
  NoteData,
  MeasureData,
} from "@/types/music-rendering/canvas/beat-canvas";
import {
  BeatCanvasPropDelegates,
  MeasureCompPropDel,
  MeasurePropDel,
  NotePropDel,
} from "@/types/music-rendering/canvas/beat-canvas/clickable-beat-canvas";
import { ClickableOverlay } from "./clickable-overlay";
import { DeepPartial } from "@/types";
import { Measurements } from "@/objects/measurement/measurements";

export class ClickableBeatCanvas extends BeatCanvas<ReactDrawingCanvas> {
  private overlay: ClickableOverlay;
  private intermDrawNote!: BeatCanvas["drawNote"];
  private intermDrawMeasures!: BeatCanvas["drawMeasure"];
  private intermDrawMeasureLines!: BeatCanvas["drawMeasureLines"]; //This is a protected method, need to store it outside of the beat canvas property
  constructor(
    drawingCanvas: ReactDrawingCanvas,
    measurements: Measurements,
    delegates?: BeatCanvasPropDelegates,
    drawOptions?: DeepPartial<BeatCanvasDrawOptions>,
    drawAboveBelow?: boolean
  ) {
    super(drawingCanvas, measurements, drawOptions, drawAboveBelow);
    this.overlay = new ClickableOverlay(
      drawingCanvas.drawRectangle.bind(drawingCanvas)
    );
    this.setDrawMeasure(delegates?.getMeasureProps);
    this.setDrawMeasureLines(delegates?.getMeasureComponentProps);
    this.setDrawNote(delegates?.getNoteProps);
  }

  private setDrawMeasure(measureHandler?: MeasurePropDel) {
    if (measureHandler) {
      this.intermDrawMeasures = (options) => {
        const dimensions = this.measurements.getMeasureDimensions();
        const props = measureHandler({ measureIndex: options.measureIndex });
        super.drawMeasure(options);
        const height = -dimensions.height;
        const width = options.totalWidth;
        this.overlay.createOverlay(
          {
            topLeft: options.topLeft,
            width,
            height,
          },
          props
        );
      };
    } else {
      this.intermDrawMeasures = super.drawMeasure;
    }
  }

  private setDrawMeasureLines(mComponentHandler?: MeasureCompPropDel) {
    if (mComponentHandler) {
      this.intermDrawMeasureLines = (options) => {
        const iteratorDel: MeasureComponentContextIterator = (context) => {
          const props = mComponentHandler({
            measureIndex: options.measureIndex,
            yPos: context.yPos,
            isBody: context.isBody,
            isLine: context.isLine,
          });
          const color = !context.isLine
            ? "white"
            : context.isBody
            ? "black"
            : "#d3d3d3";
          this.canvas.drawRectangle({
            corner: context.corner,
            width: context.width,
            height: -context.height,
            drawOptions: { color },
            props,
          });
        };
        return this.iterateMeasureLines(options, iteratorDel);
      };
    } else {
      this.intermDrawMeasureLines = super.drawMeasureLines;
    }
  }

  private setDrawNote(notePropHandler?: NotePropDel) {
    if (notePropHandler) {
      this.intermDrawNote = (options) => {
        const endOfStem = super.drawNote(options);
        const width = this.getNoteBodyWidth(options.bodyHeight);
        let height;
        let y, x;
        if (endOfStem.y < options.bodyCenter.y) {
          y = options.bodyCenter.y + options.bodyHeight / 2;
          x = endOfStem.x;
          height = y - endOfStem.y;
        } else {
          y = endOfStem.y;
          x = endOfStem.x - width;
          height = y - (options.bodyCenter.y - options.bodyHeight / 2);
        }
        const topLeft = { x, y };
        const props = notePropHandler({
          measureIndex: options.measureIndex,
          noteIndex: options.noteIndex,
        });
        this.overlay.createOverlay(
          {
            topLeft,
            width,
            height: -height,
          },
          props
        );
        return endOfStem;
      };
    } else {
      this.intermDrawNote = super.drawNote;
    }
  }

  protected drawMeasureLines(options: MeasureLinesOptions) {
    this.intermDrawMeasureLines(options);
  }

  drawMeasure(options: MeasureData): void {
    return this.intermDrawMeasures(options);
  }

  drawNote(options: NoteData): { x: number; y: number } {
    return this.intermDrawNote(options);
  }

  public createCanvas(options: any) {
    return this.canvas.createCanvas(options);
  }
}
