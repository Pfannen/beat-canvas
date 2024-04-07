import {
  IClickHandlerAttachment,
  MeasureComponentClickDel,
  MeasureComponentIdentifier,
} from "@/types/music-rendering/canvas/clickable-beat-canvas";
import { ComponentProps } from "@/types/polymorphic";

export class MeasureComponentAttachment
  implements
    IClickHandlerAttachment<MeasureComponentIdentifier, ComponentProps<"div">>
{
  private onMeasureComponentClick: MeasureComponentClickDel;
  constructor(onMeasureComponentClick: MeasureComponentClickDel) {
    this.onMeasureComponentClick = onMeasureComponentClick;
  }
  attachHandler(
    identifiers: MeasureComponentIdentifier
  ): ComponentProps<"div"> {
    return {
      onClick: this.onMeasureComponentClick.bind(
        null,
        identifiers.measureIndex,
        identifiers.absoluteYPos
      ),
    };
  }
}
