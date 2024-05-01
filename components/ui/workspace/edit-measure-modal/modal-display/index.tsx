import classes from "./index.module.css";
import { CSSProperties, FunctionComponent, useEffect } from "react";
import { Selection } from "@/components/hooks/useSelection";
import ModalMeasureDisplay from "../modal-measure-display";
import { ABOVE_BELOW_CT, LINE_TO_SPACE_R } from "@/constants/music-dimensions";
import { PositionData } from "@/types/ui/music-modal";
import { Coordinate } from "@/types";
import AssignerButtonRepo from "@/components/ui/reusable/assigner-components/assigner-button-repo";
import { stacklessNotePlacementValidator } from "@/utils/music/note-placement";
import { useEditMeasures } from "@/components/hooks/useEditMeasures";
import WhiteBgButton from "@/components/ui/reusable/buttons/white-bg-button";

const aspectRatio = 2.5;
const width = 1000;
const unit = "px";
const lineToSpaceRatio = 0.5;

type ModalDisplayProps = {
  liftCommitMeasures: (fn: Function) => void;
  selectedMeasures: Selection;
};

const ModalDisplay: FunctionComponent<ModalDisplayProps> = ({
  liftCommitMeasures,
  selectedMeasures,
}) => {
  const { start, end } = selectedMeasures;
  const {
    editMeasures,
    selections,
    isSegmentSelected,
    executeAssigner,
    updateSelection,
    commitMeasures,
    isYLevelSelected,
  } = useEditMeasures(start, end);

  useEffect(() => {
    liftCommitMeasures(commitMeasures);
  }, [commitMeasures]);

  const onPositionClick = (
    position: Coordinate,
    positionData: PositionData
  ) => {
    const { x, y } = position;
    const { measureIndex, noteIndices } = positionData;
    updateSelection(measureIndex, x, x, y, noteIndices && noteIndices[0]);
  };
  return (
    <div className={classes.edit_modal_container}>
      <div className={classes.header_container}>
        <div className={classes.header_items}>
          <h1>Edit Measures</h1>
          <WhiteBgButton onClick={commitMeasures}>Finish Editing</WhiteBgButton>
        </div>
      </div>
      <div
        className={classes.measures}
        style={
          { "--aspect-ratio": aspectRatio, "--width": width } as CSSProperties
        }
      >
        <ModalMeasureDisplay
          aspectRatio={aspectRatio}
          measures={editMeasures}
          height={width / aspectRatio}
          unit={unit}
          lineToSpaceRatio={lineToSpaceRatio}
          aboveBelowCt={ABOVE_BELOW_CT}
          onPositionClick={onPositionClick}
          isYPosSelected={isYLevelSelected}
          isSegmentSelected={isSegmentSelected}
        />
      </div>
      <div className={classes.assigner_container}>
        <AssignerButtonRepo
          selections={selections}
          notePlacementValidator={stacklessNotePlacementValidator}
          liftExecutor={executeAssigner}
        />
      </div>
    </div>
  );
};

export default ModalDisplay;
