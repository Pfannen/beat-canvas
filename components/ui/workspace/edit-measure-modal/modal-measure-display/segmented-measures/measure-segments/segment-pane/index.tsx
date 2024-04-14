import { fractionToPercent } from "@/utils";
import classes from "./index.module.css";
import { CSSProperties, FunctionComponent } from "react";

const widthMap: { [key: string]: string } = { "1": "orange" };

type SegmentPaneProps = {
  onClick: () => void;
  onAuxClick: () => void;
  width: number;
};

const SegmentPane: FunctionComponent<SegmentPaneProps> = ({
  onClick,
  onAuxClick,
  width,
}) => {
  return (
    <div
      className={classes.pane}
      style={
        {
          "--width": fractionToPercent(width),
          "--color": widthMap[width] || "orange",
        } as CSSProperties
      }
      onClick={onClick}
      onAuxClick={onAuxClick}
    />
  );
};

export default SegmentPane;
