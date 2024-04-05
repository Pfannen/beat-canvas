import { UnitMeasurement } from "@/types";
import { BeatCanvas } from "..";
import { ReactDrawingCanvas } from "../../drawing-canvas/react-drawing-canvas";
import { MeasureOptions } from "@/types/music-rendering/canvas";

type ClickDelegate = (index: number) => void;

export class ClickableBeatCanvas extends BeatCanvas {
  private onMeasureClick: ClickDelegate;

  constructor(unit: UnitMeasurement, onMeasureClick: ClickDelegate) {
    const drawingCanvas = new ReactDrawingCanvas(unit);
    super(drawingCanvas);
    this.onMeasureClick = onMeasureClick;
  }

  drawMeasure(options: MeasureOptions): void {
    options.measureIndex;
  }
}
