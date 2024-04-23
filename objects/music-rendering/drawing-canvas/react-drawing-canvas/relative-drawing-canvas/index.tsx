import { UnitConverter } from "@/types";
import { ReactDrawingCanvas } from "..";
import { HTMLSVGOptions } from "@/types/music-rendering/canvas/drawing-canvas/html";
import { getSVGWidth } from "@/utils/svg";

export class RelativeDrawingCanvas extends ReactDrawingCanvas {
  private svgWidthConverter: UnitConverter<number, number>;
  constructor(svgWidthConverter: UnitConverter<number, number>) {
    super("%");
    this.svgWidthConverter = svgWidthConverter;
  }
  public drawSVG(options: HTMLSVGOptions): void {
    options.width = this.svgWidthConverter(getSVGWidth(options.viewBox));
    super.drawSVG(options);
  }
}
