import classes from "./index.module.css";
import { CSSProperties, FunctionComponent } from "react";

const widthMap: { [key: string]: string } = { "1": "black" };

type SegmentPaneProps = {
  onClick: () => void;
  width: string;
};

const SegmentPane: FunctionComponent<SegmentPaneProps> = ({
  onClick,
  width,
}) => {
  return (
    <div
      className={classes.pane}
      style={
        {
          "--width": width,
          "--color": widthMap[width] || "white",
        } as CSSProperties
      }
      onClick={onClick}
    />
  );
};

export default SegmentPane;
