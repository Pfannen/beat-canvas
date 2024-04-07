"use client";

import { UnitMeasurement } from "@/types";
import { BeatCanvas } from "..";
import { ReactDrawingCanvas } from "../../drawing-canvas/react-drawing-canvas";
import {
  MeasureLineIteratorDel,
  MeasureLinesOptions,
  MeasureOptions,
} from "@/types/music-rendering/canvas/beat-canvas";
import {
  AbsolutePositionConverter,
  ClickDelegate,
} from "@/types/music-rendering/canvas/clickable-beat-canvas";
import { MeasureOverlay } from "./handler-strategies/overlay/strategies";

export class ClickableBeatCanvas extends BeatCanvas<ReactDrawingCanvas> {
  private absolutePosToYPos: AbsolutePositionConverter;
  private measureOverlays?: MeasureOverlay[];
  constructor(
    unit: UnitMeasurement,
    absolutePosToYPos: AbsolutePositionConverter,
    measureHandlers?: ClickDelegate[]
  ) {
    const drawingCanvas = new ReactDrawingCanvas(unit);
    super(drawingCanvas);
    this.absolutePosToYPos = absolutePosToYPos;
    measureHandlers?.forEach((handler) => {
      if (!this.measureOverlays) {
        this.measureOverlays = [];
      }
      this.measureOverlays.push(
        new MeasureOverlay(
          drawingCanvas.drawRectangle.bind(drawingCanvas),
          handler
        )
      );
    });
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

  private invokeMeasureOverlays(options: MeasureOptions) {
    if (this.measureOverlays) {
      const height = -BeatCanvas.getMeasureContainerHeight(options);
      const width = options.width;
      this.measureOverlays.forEach((overlay) => {
        overlay.createOverlay({
          topLeft: options.topLeft,
          width,
          height,
          indentifiers: { measureIndex: options.measureIndex },
        });
      });
    }
  }

  drawMeasure(options: MeasureOptions): void {
    super.drawMeasure(options);
    this.invokeMeasureOverlays(options);
  }

  public createCanvas(options: any) {
    return this.canvas.createCanvas(options);
  }
}
