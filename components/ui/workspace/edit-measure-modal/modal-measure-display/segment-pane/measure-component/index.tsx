import { concatClassNames } from "@/utils/css";
import classes from "./index.module.css";
import { FunctionComponent } from "react";

type MeasureComponentProps = {
  onClick: () => void;
  height: string;
  isSelected: boolean;
};

const MeasureComponent: FunctionComponent<MeasureComponentProps> = ({
  onClick,
  height,
  isSelected,
}) => {
  return (
    <div
      onClick={onClick}
      style={{ height: height }}
      className={concatClassNames(
        classes.component,
        isSelected && classes.selected
      )}
    />
  );
};

export default MeasureComponent;
