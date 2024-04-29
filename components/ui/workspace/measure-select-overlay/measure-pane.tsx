import classes from "./measure-pane.module.css";
import { CSSProperties, FunctionComponent } from "react";
import { concatClassNames } from "@/utils/css";
import { CSSPosition } from "@/types";

type MeasurePaneProps = {
  position: CSSPosition;
  isSelected: boolean;
  areSelections: boolean;
  onPaneClick: () => void;
};

const MeasurePane: FunctionComponent<MeasurePaneProps> = ({
  position,
  isSelected,
  areSelections,
  onPaneClick,
}) => {
  return (
    <div
      className={concatClassNames(
        classes.pane,
        isSelected ? classes.selected : areSelections && classes.not_selected
      )}
      onClick={onPaneClick}
      style={
        {
          "--top": position.top,
          "--left": position.left,
          "--width": position.width,
          "--height": position.height,
        } as CSSProperties
      }
    />
  );
};

export default MeasurePane;
