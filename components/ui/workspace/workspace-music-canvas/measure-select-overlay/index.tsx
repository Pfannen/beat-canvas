import { MeasureRenderArgs } from "@/types/music-rendering";
import { FunctionComponent } from "react";
import MeasurePane from "./measure-pane";

type MeasureSelectOverlayProps = {
  measurePositions: MeasureRenderArgs[];
  areSelections: boolean;
  onMeasureSelect: (measureIndex: number) => void;
  isMeasureSelected: (measureIndex: number) => boolean;
};

const MeasureSelectOverlay: FunctionComponent<MeasureSelectOverlayProps> = ({
  measurePositions,
  areSelections,
  onMeasureSelect,
  isMeasureSelected,
}) => {
  return (
    <>
      {measurePositions.map((pos) => {
        return (
          <MeasurePane
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
