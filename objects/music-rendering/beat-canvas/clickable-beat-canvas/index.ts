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
  MeasureComponentClickDel,
} from "@/types/music-rendering/canvas/clickable-beat-canvas";
import { MeasureOverlay } from "./handler-strategies/overlay/strategies";
import { MeasureComponentAttachment } from "./handler-strategies/attachment";
import { ComponentProps } from "@/types/polymorphic";

export class ClickableBeatCanvas extends BeatCanvas<ReactDrawingCanvas> {
  private absolutePosToYPos: AbsolutePositionConverter;
  private clickHandlers: ClickHandlers;
  constructor(
    unit: UnitMeasurement,
    absolutePosToYPos: AbsolutePositionConverter,
    measureHandler?: ClickDelegate,
    mComponentHandler?: MeasureComponentClickDel
  ) {
    const drawingCanvas = new ReactDrawingCanvas(unit);
    super(drawingCanvas);
    this.absolutePosToYPos = absolutePosToYPos;
    this.clickHandlers = new ClickHandlers(
      drawingCanvas,
      measureHandler,
      mComponentHandler
    );
  }

  protected drawMeasureLines(options: MeasureLinesOptions) {
    const drawAllComponents = !!this.clickHandlers.measureComponentAttachment;
    const iteratorDel: MeasureLineIteratorDel = (context) => {
      if (drawAllComponents || (context.isBody && context.isLine)) {
        let props: ComponentProps<"div"> = {};
        if (drawAllComponents) {
          props = this.clickHandlers.measureComponentAttachment!.attachHandler({
            measureIndex: options.measureIndex,
            absoluteYPos: context.absoluteYPos,
          });
        }
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
      }
    };
    return BeatCanvas.iterateMeasureLines(options, iteratorDel);
  }

  private invokeMeasureOverlays(options: MeasureOptions) {
    if (this.clickHandlers.measureOverlay) {
      const height = -BeatCanvas.getMeasureContainerHeight(options);
      const width = options.width;
      this.clickHandlers.measureOverlay.createOverlay({
        topLeft: options.topLeft,
        width,
        height,
        indentifiers: { measureIndex: options.measureIndex },
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

class ClickHandlers {
  private drawRectangle: ReactDrawingCanvas["drawRectangle"];
  public measureOverlay?: MeasureOverlay;
  public measureComponentAttachment?: MeasureComponentAttachment;

  constructor(
    canvas: ReactDrawingCanvas,
    measureHandler?: ClickDelegate,
    mComponentHandler?: MeasureComponentClickDel
  ) {
    this.drawRectangle = canvas.drawRectangle.bind(canvas);
    this.initializeMeasureOverlay(measureHandler);
    this.initializeMeasureComponentAttchment(mComponentHandler);
  }

  private initializeMeasureOverlay(measureHandler?: ClickDelegate) {
    if (measureHandler) {
      this.measureOverlay = new MeasureOverlay(
        this.drawRectangle,
        measureHandler
      );
    }
  }

  private initializeMeasureComponentAttchment(
    mComponentHandler?: MeasureComponentClickDel
  ) {
    if (mComponentHandler) {
      this.measureComponentAttachment = new MeasureComponentAttachment(
        mComponentHandler
      );
    }
  }
}

// class BeatCanvasClickMethods {
//   static getDrawMeasure(
//     handler: ClickDelegate,
//     drawRectangle: ReactDrawingCanvas["drawRectangle"]
//   ) {
//     const measureOverlay = new MeasureOverlay(drawRectangle, handler);
//     return (options: MeasureOptions) => {
//       const height = -BeatCanvas.getMeasureContainerHeight(options);
//       const width = options.width;
//       this.clickHandlers.measureOverlay.createOverlay({
//         topLeft: options.topLeft,
//         width,
//         height,
//         indentifiers: { measureIndex: options.measureIndex },
//       });
//     }
//   }
// }
