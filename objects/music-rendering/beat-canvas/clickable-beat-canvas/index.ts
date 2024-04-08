"use client";

import { UnitMeasurement } from "@/types";
import { BeatCanvas } from "..";
import { ReactDrawingCanvas } from "../../drawing-canvas/react-drawing-canvas";
import { MeasureLineIteratorDel } from "@/types/music-rendering/canvas/beat-canvas";
import {
  MeasureClickDel,
  MeasureCompClickDel,
  NoteClickDel,
} from "@/types/music-rendering/canvas/clickable-beat-canvas";
import { MeasureComponentAttachment } from "./handler-strategies/attachment";
import { ClickableOverlay } from "./handler-strategies/clickable-overlay";

export class ClickableBeatCanvas extends BeatCanvas<ReactDrawingCanvas> {
  private overlay: ClickableOverlay;
  constructor(
    unit: UnitMeasurement,
    measureHandler?: MeasureClickDel,
    mComponentHandler?: MeasureCompClickDel,
    noteClickHandler?: NoteClickDel
  ) {
    const drawingCanvas = new ReactDrawingCanvas(unit);
    super(drawingCanvas);
    this.overlay = new ClickableOverlay(
      drawingCanvas.drawRectangle.bind(drawingCanvas)
    );
    this.setDrawMeasure(measureHandler);
    this.setDrawMeasureLines(mComponentHandler);
    this.setDrawNote(noteClickHandler);
  }

  private setDrawMeasure(measureHandler?: MeasureClickDel) {
    if (measureHandler) {
      this.drawMeasure = (options) => {
        super.drawMeasure(options);
        const height = -BeatCanvas.getMeasureContainerHeight(options);
        const width = options.width;
        this.overlay.createOverlay({
          topLeft: options.topLeft,
          width,
          height,
          onClick: measureHandler.bind(null, {
            measureIndex: options.measureIndex,
          }),
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

  private setDrawNote(noteClickHandler?: NoteClickDel) {
    if (noteClickHandler) {
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
        this.overlay.createOverlay({
          topLeft,
          width,
          height: -height,
          onClick: noteClickHandler.bind(null, {
            measureIndex: options.measureIndex,
            noteIndex: options.noteIndex,
          }),
        });
        return endOfStem;
      };
    }
  }

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
