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
} from "@/types/music-rendering/canvas/clickable-canvas";

export class ClickableBeatCanvas extends BeatCanvas<ReactDrawingCanvas> {
  private onMeasureClick: ClickDelegate;
  private absolutePosToYPos: AbsolutePositionConverter;

  constructor(
    unit: UnitMeasurement,
    absolutePosToYPos: AbsolutePositionConverter,
    onMeasureClick: ClickDelegate
  ) {
    const drawingCanvas = new ReactDrawingCanvas(unit);
    super(drawingCanvas);
    this.absolutePosToYPos = absolutePosToYPos;
    this.onMeasureClick = onMeasureClick;
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
    const height = -BeatCanvas.getMeasureContainerHeight(options);
    const width = options.width;
    this.canvas.drawRectangle({
      corner: options.topLeft,
      width,
      height,
      drawOptions: { opacity: 0, cursor: "pointer" },
      onClick: this.onMeasureClick.bind(null, options.measureIndex),
    });
  }

  public createCanvas(options: any) {
    return this.canvas.createCanvas(options);
  }
}
