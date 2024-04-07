import { ReactDrawingCanvas } from "@/objects/music-rendering/drawing-canvas/react-drawing-canvas";
import {
  ClickableOverlayContext,
  IClickableOverlay,
} from "@/types/music-rendering/canvas/clickable-beat-canvas";
import { HTMLRectangleOptions } from "@/types/music-rendering/canvas/html";

export abstract class ClickableOverlay<T> implements IClickableOverlay<T> {
  protected drawRectangle: ReactDrawingCanvas["drawRectangle"];

  constructor(drawRectangle: ReactDrawingCanvas["drawRectangle"]) {
    this.drawRectangle = drawRectangle;
  }

  protected drawOverlay(
    context: ClickableOverlayContext<T>,
    onClick: () => void,
    props?: Omit<
      HTMLRectangleOptions<"div">,
      "onClick" & ClickableOverlayContext<T> & "corner"
    >
  ) {
    const drawOptions = props?.drawOptions
      ? props.drawOptions
      : { opacity: 0, cursor: "pointer" };
    this.drawRectangle({
      ...props,
      drawOptions,
      onClick,
      corner: context.topLeft,
      width: context.width,
      height: context.height,
    });
  }

  abstract createOverlay(context: ClickableOverlayContext<T>): void;
}
