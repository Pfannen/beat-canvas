import {
  MeasureComponentIterator,
  MeasureComponentValues,
} from "@/types/music-rendering";
import classes from "./index.module.css";
import { CSSProperties, FunctionComponent, ReactNode } from "react";
import MeasureComponent from "./measure-component";
import { fractionToPercent } from "@/utils";
import SegmentButton from "./segment-button";
import { concatClassNames } from "@/utils/css";

type SegmentPaneProps = {
  width: number;
  componentIterator: MeasureComponentIterator;
  componentFractions: MeasureComponentValues;
  onComponentClick: (yPos: number) => void;
  noteContainerHeight: number;
  onSplit: () => void;
  onJoin: () => void;
};

const SegmentPane: FunctionComponent<SegmentPaneProps> = ({
  width,
  componentIterator,
  componentFractions,
  onComponentClick,
  noteContainerHeight,
  onSplit,
  onJoin,
}) => {
  const components: ReactNode[] = [];
  componentIterator((component) => {
    const height = component.isLine
      ? componentFractions.line
      : componentFractions.space;
    components.push(
      <MeasureComponent
        height={fractionToPercent(height)}
        onClick={onComponentClick.bind(null, component.yPos)}
      />
    );
  });
  return (
    <div
      className={classes.pane}
      style={
        {
          "--width": fractionToPercent(width),
          "--height": noteContainerHeight + "%",
        } as CSSProperties
      }
    >
      <SegmentButton
        onClick={onSplit}
        className={concatClassNames(classes.pane_button, classes.split)}
      >
        Split
      </SegmentButton>
      {components}
      <SegmentButton onClick={onJoin} className={classes.pane_button}>
        Join
      </SegmentButton>
    </div>
  );
};

export default SegmentPane;
