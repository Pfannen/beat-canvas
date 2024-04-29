import { MeasureRenderArgs } from "@/types/music-rendering";
import { MeasureOverlay } from "@/types/workspace";
import { appendUnit } from "@/utils";
import { useState } from "react";

const useOverlayPositions = (pageHeight: number) => {
  const [overlayPositions, setOverlayPositions] = useState<MeasureOverlay[]>(
    []
  );

  const onMeasureRendered = (measure: MeasureRenderArgs) => {
    const topOffset = (measure.pageNumber - 1) * pageHeight;
    const top = pageHeight - measure.topLeft.y + topOffset;
    const position: MeasureOverlay = {
      top: appendUnit(top, measure.unit),
      left: appendUnit(measure.topLeft.x, measure.unit),
      width: appendUnit(measure.width, measure.unit),
      height: appendUnit(measure.height, measure.unit),
      measureIndex: measure.measureIndex,
    };
    setOverlayPositions((currentPositions) => {
      if (measure.measureIndex === 0) {
        return [position];
      }
      currentPositions.push(position);
      return currentPositions;
    }); //This will add two overlays per measure due to react strict mode
  };

  return { onMeasureRendered, overlayPositions };
};

export default useOverlayPositions;
