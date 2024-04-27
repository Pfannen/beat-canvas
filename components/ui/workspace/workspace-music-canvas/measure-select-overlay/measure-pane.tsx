import { MeasureRenderArgs } from "@/types/music-rendering";
import classes from "./measure-pane.module.css";
import { CSSProperties, FunctionComponent } from "react";
import { concatClassNames } from "@/utils/css";

type MeasurePaneProps = {
  position: MeasureRenderArgs;
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
        areSelections && !isSelected && classes.not_selected
      )}
      onClick={onPaneClick}
      style={
        {
          "--top": position.topLeft.y,
          "--left": position.topLeft.x,
          "--width": position.width,
          "--height": position.height,
        } as CSSProperties
      }
    />
  );
};

export default MeasurePane;
