import { MeasureRenderArgs } from "@/types/music-rendering";
import classes from "./measure-pane.module.css";
import { CSSProperties, FunctionComponent } from "react";
import { concatClassNames } from "@/utils/css";
import { appendUnit } from "@/utils";

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
  const topOffset = (position.pageNumber - 1) * 100;
  const top = 100 - position.topLeft.y + topOffset;
  return (
    <div
      className={concatClassNames(
        classes.pane,
        isSelected ? classes.selected : areSelections && classes.not_selected
      )}
      onClick={onPaneClick}
      style={
        {
          "--top": appendUnit(top, position.unit),
          "--left": appendUnit(position.topLeft.x, position.unit),
          "--width": appendUnit(position.width, position.unit),
          "--height": appendUnit(position.height, position.unit),
        } as CSSProperties
      }
    />
  );
};

export default MeasurePane;
