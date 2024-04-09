import { ReactDrawingCanvas } from "@/objects/music-rendering/drawing-canvas/react-drawing-canvas";
import { ClickableOverlayContext } from "@/types/music-rendering/canvas/clickable-beat-canvas";

type DrawRectangleParams = Parameters<ReactDrawingCanvas["drawRectangle"]>[0];

export class ClickableOverlay {
  private drawRectangle: ReactDrawingCanvas["drawRectangle"];

  constructor(drawRectangle: ReactDrawingCanvas["drawRectangle"]) {
    this.drawRectangle = drawRectangle;
  }

  public createOverlay(
    context: ClickableOverlayContext,
    props: DrawRectangleParams["props"] & {
      drawOptions?: DrawRectangleParams["drawOptions"];
    }
  ) {
    const drawOptions = props?.drawOptions
      ? props.drawOptions
      : { opacity: 0, cursor: "pointer" };

    this.drawRectangle({
      drawOptions,
      corner: context.topLeft,
      width: context.width,
      height: context.height,
      props,
    });
  }
}
