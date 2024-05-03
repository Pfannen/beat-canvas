import { FunctionComponent } from "react";
import MeasurePane from "./measure-pane";
import { MeasureOverlay } from "@/types/workspace";

type MeasureSelectOverlayProps = {
  overlayPositions: MeasureOverlay[];
  areSelections: boolean;
  onMeasureSelect: (measureIndex: number) => void;
  isMeasureSelected: (measureIndex: number) => boolean;
};

const MeasureSelectOverlay: FunctionComponent<MeasureSelectOverlayProps> = ({
  overlayPositions,
  areSelections,
  onMeasureSelect,
  isMeasureSelected,
}) => {
  return (
    <>
      {overlayPositions.map((pos) => {
        return (
          <MeasurePane
            key={pos.measureIndex}
            position={pos}
            isSelected={isMeasureSelected(pos.measureIndex)}
            onPaneClick={onMeasureSelect.bind(null, pos.measureIndex)}
            areSelections={areSelections}
          />
        );
      })}
    </>
  );
};

export default MeasureSelectOverlay;
