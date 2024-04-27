import { CanvasManager } from "@/types/music-rendering/canvas/canvas-manager";
import { ReactDrawingCanvas } from ".";
import { ReactNode } from "react";
import { Measurements } from "@/objects/measurement/measurements";
import { UnitConverter, UnitMeasurement } from "@/types";
import { BeatCanvas } from "../../beat-canvas";
import {
  createXValueConverter,
  getRelativeCanvasDrawOptions,
} from "@/utils/music-rendering";

export class ReactCanvasManager extends CanvasManager<ReactDrawingCanvas> {
  private svgWidthConverter?: UnitConverter<number, number>;
  constructor(
    measurements: Measurements,
    private unit: UnitMeasurement,
    aspectRatio?: number,
    drawNonBodyComponents?: boolean
  ) {
    super(measurements);
    if (unit === "%" && aspectRatio) {
      const drawOptions = getRelativeCanvasDrawOptions(aspectRatio);
      this.svgWidthConverter = createXValueConverter(aspectRatio);
      this.getBeatCanvasConstructor = () => (c, m) => {
        return new BeatCanvas(c, m, drawOptions, drawNonBodyComponents);
      };
    }
  }

  createDrawingCanvas(): ReactDrawingCanvas {
    return new ReactDrawingCanvas(this.unit, this.svgWidthConverter);
  }

  public createCanvas(
    pageNumber: number,
    ...args: Parameters<ReactDrawingCanvas["createCanvas"]>
  ) {
    return this.getDrawingCanvasPage(pageNumber)!.createCanvas(...args);
  }

  public getPages(...args: Parameters<ReactDrawingCanvas["createCanvas"]>) {
    const canvasCount = this.getPageCount();
    const canvases: ReactNode[] = [];
    for (let i = 0; i < canvasCount; i++) {
      canvases.push(this.createCanvas(i + 1, ...args));
    }
    return canvases;
  }
}
