import { Measure } from "@/components/providers/music/types";
import classes from "./index.module.css";
import { CSSProperties, FunctionComponent } from "react";
import { Selection } from "@/components/hooks/useSelection";
import ModalMeasureDispay from "../modal-measure-display";
import { ABOVE_BELOW_CT } from "@/objects/measurement/constants";
import { MusicPosition } from "@/types/ui/music-modal";

const aspectRatio = 4;

type ModalDisplayProps = {
  getMeasures: (startIndex: number, count: number) => Measure[];
  selectedMeasures: Selection;
};

const ModalDisplay: FunctionComponent<ModalDisplayProps> = ({
  getMeasures,
  selectedMeasures,
}) => {
  const onPositionClick = (position: MusicPosition) => {
    console.log(position);
  };
  return (
    <div
      className={classes.measures}
      style={{ "--aspect-ratio": aspectRatio } as CSSProperties}
    >
      <ModalMeasureDispay
        aspectRatio={aspectRatio}
        measures={getMeasures(selectedMeasures.start, 1)}
        aboveBelowCt={ABOVE_BELOW_CT}
        onPositionClick={onPositionClick}
        startMeasureGlobalIndex={selectedMeasures.start}
      />
    </div>
  );
};

export default ModalDisplay;
