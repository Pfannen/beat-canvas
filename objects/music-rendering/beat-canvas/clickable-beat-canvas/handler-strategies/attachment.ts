import {
  IClickHandlerAttachment,
  MeasureCompClickDel,
  MeasureComponentIdentifier,
} from "@/types/music-rendering/canvas/clickable-beat-canvas";
import { ComponentProps } from "@/types/polymorphic";

export class MeasureComponentAttachment
  implements
    IClickHandlerAttachment<MeasureComponentIdentifier, ComponentProps<"div">>
{
  private onMeasureComponentClick: MeasureCompClickDel;
  constructor(onMeasureComponentClick: MeasureCompClickDel) {
    this.onMeasureComponentClick = onMeasureComponentClick;
  }
  attachHandler(
    identifiers: MeasureComponentIdentifier
  ): ComponentProps<"div"> {
    return {
      onClick: this.onMeasureComponentClick.bind(null, identifiers),
    };
  }
}
