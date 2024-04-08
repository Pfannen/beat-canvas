import { ReactDrawingCanvas } from "@/objects/music-rendering/drawing-canvas/react-drawing-canvas";
import { ClickableOverlayContext } from "@/types/music-rendering/canvas/clickable-beat-canvas";
import { HTMLRectangleOptions } from "@/types/music-rendering/canvas/html";

export class ClickableOverlay {
  private drawRectangle: ReactDrawingCanvas["drawRectangle"];

  constructor(drawRectangle: ReactDrawingCanvas["drawRectangle"]) {
    this.drawRectangle = drawRectangle;
  }

  public createOverlay(
    context: ClickableOverlayContext,
    props?: Omit<HTMLRectangleOptions<"div">, "corner" | "width" | "height">
  ) {
    const drawOptions = props?.drawOptions
      ? props.drawOptions
      : { opacity: 0, cursor: "pointer" };
    this.drawRectangle({
      ...props,
      drawOptions,
      corner: context.topLeft,
      width: context.width,
      height: context.height,
    });
  }
}
