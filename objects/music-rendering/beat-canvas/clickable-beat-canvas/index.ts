"use client";

import { UnitMeasurement } from "@/types";
import { BeatCanvas } from "..";
import { ReactDrawingCanvas } from "../../drawing-canvas/react-drawing-canvas";
import { MeasureLineIteratorDel } from "@/types/music-rendering/canvas/beat-canvas";
import {
  MeasureClickDel,
  MeasureCompClickDel,
} from "@/types/music-rendering/canvas/clickable-beat-canvas";
import { MeasureOverlay } from "./handler-strategies/overlay/strategies";
import { MeasureComponentAttachment } from "./handler-strategies/attachment";

export class ClickableBeatCanvas extends BeatCanvas<ReactDrawingCanvas> {
  private drawRectangle: ReactDrawingCanvas["drawRectangle"];
  constructor(
    unit: UnitMeasurement,
    measureHandler?: MeasureClickDel,
    mComponentHandler?: MeasureCompClickDel
  ) {
    const drawingCanvas = new ReactDrawingCanvas(unit);
    super(drawingCanvas);
    this.drawRectangle = drawingCanvas.drawRectangle.bind(drawingCanvas);
    this.setDrawMeasure(measureHandler);
    this.setDrawMeasureLines(mComponentHandler);
  }

  private setDrawMeasure(measureHandler?: MeasureClickDel) {
    if (measureHandler) {
      const measureOverlay = new MeasureOverlay(
        this.drawRectangle,
        measureHandler
      );
      this.drawMeasure = (options) => {
        super.drawMeasure(options);
        const height = -BeatCanvas.getMeasureContainerHeight(options);
        const width = options.width;
        measureOverlay.createOverlay({
          topLeft: options.topLeft,
          width,
          height,
          identifiers: { measureIndex: options.measureIndex },
        });
      };
    }
  }

  private setDrawMeasureLines(mComponentHandler?: MeasureCompClickDel) {
    if (mComponentHandler) {
      this.drawMeasureLines = (options) => {
        const componentAttachment = new MeasureComponentAttachment(
          mComponentHandler
        );
        const iteratorDel: MeasureLineIteratorDel = (context) => {
          const props = componentAttachment.attachHandler({
            measureIndex: options.measureIndex,
            absoluteYPos: context.absoluteYPos,
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

  // private setDrawNote();

  public createCanvas(options: any) {
    return this.canvas.createCanvas(options);
  }
}

// class ClickHandlers {
//   private drawRectangle: ReactDrawingCanvas["drawRectangle"];
//   public measureOverlay?: MeasureOverlay;
//   public measureComponentAttachment?: MeasureComponentAttachment;

//   constructor(
//     canvas: ReactDrawingCanvas,
//     measureHandler?: ClickDelegate,
//     mComponentHandler?: MeasureComponentClickDel
//   ) {
//     this.drawRectangle = canvas.drawRectangle.bind(canvas);
//     this.initializeMeasureOverlay(measureHandler);
//     this.initializeMeasureComponentAttchment(mComponentHandler);
//   }

//   private initializeMeasureOverlay(measureHandler?: ClickDelegate) {
//     if (measureHandler) {
//       this.measureOverlay = new MeasureOverlay(
//         this.drawRectangle,
//         measureHandler
//       );
//     }
//   }

//   private initializeMeasureComponentAttchment(
//     mComponentHandler?: MeasureComponentClickDel
//   ) {
//     if (mComponentHandler) {
//       this.measureComponentAttachment = new MeasureComponentAttachment(
//         mComponentHandler
//       );
//     }
//   }
// }

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
//         identifiers: { measureIndex: options.measureIndex },
//       });
//     }
//   }
// }
