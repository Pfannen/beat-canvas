import classes from "./index.module.css";
import { FunctionComponent } from "react";

type MeasureComponentProps = {
  onClick: () => void;
  height: string;
};

const MeasureComponent: FunctionComponent<MeasureComponentProps> = ({
  onClick,
  height,
}) => {
  return (
    <div
      onClick={onClick}
      style={{ height: height }}
      className={classes.component}
    />
  );
};

export default MeasureComponent;
