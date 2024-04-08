"use client";

import { UnitMeasurement } from "@/types";
import { BeatCanvas } from "..";
import { ReactDrawingCanvas } from "../../drawing-canvas/react-drawing-canvas";
import { MeasureLineIteratorDel } from "@/types/music-rendering/canvas/beat-canvas";
import {
  MeasureCompPropDel,
  MeasurePropDel,
  NotePropDel,
} from "@/types/music-rendering/canvas/clickable-beat-canvas";
import { ClickableOverlay } from "./clickable-overlay";

export class ClickableBeatCanvas extends BeatCanvas<ReactDrawingCanvas> {
  private overlay: ClickableOverlay;
  constructor(
    unit: UnitMeasurement,
    measureHandler?: MeasurePropDel,
    mComponentHandler?: MeasureCompPropDel,
    notePropHandler?: NotePropDel
  ) {
    const drawingCanvas = new ReactDrawingCanvas(unit);
    super(drawingCanvas);
    this.overlay = new ClickableOverlay(
      drawingCanvas.drawRectangle.bind(drawingCanvas)
    );
    this.setDrawMeasure(measureHandler);
    this.setDrawMeasureLines(mComponentHandler);
    this.setDrawNote(notePropHandler);
  }

  private setDrawMeasure(measureHandler?: MeasurePropDel) {
    if (measureHandler) {
      this.drawMeasure = (options) => {
        const props = measureHandler({ measureIndex: options.measureIndex });
        super.drawMeasure(options);
        const height = -BeatCanvas.getMeasureContainerHeight(options);
        const width = options.width;
        this.overlay.createOverlay(
          {
            topLeft: options.topLeft,
            width,
            height,
          },
          props
        );
      };
    }
  }

  private setDrawMeasureLines(mComponentHandler?: MeasureCompPropDel) {
    if (mComponentHandler) {
      this.drawMeasureLines = (options) => {
        const iteratorDel: MeasureLineIteratorDel = (context) => {
          const props = mComponentHandler({
            measureIndex: options.measureIndex,
            absoluteYPos: context.absoluteYPos,
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
            ...props,
          });
        };
        return BeatCanvas.iterateMeasureLines(options, iteratorDel);
      };
    }
  }

  private setDrawNote(notePropHandler?: NotePropDel) {
    if (notePropHandler) {
      this.drawNote = (options) => {
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
    }
  }

  public createCanvas(options: any) {
    return this.canvas.createCanvas(options);
  }
}
