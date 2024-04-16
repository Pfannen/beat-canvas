import {
  MeasureComponentIterator,
  MeasureComponentValues,
} from "@/types/music-rendering";
import classes from "./index.module.css";
import { CSSProperties, FunctionComponent, ReactNode } from "react";
import MeasureComponent from "./measure-component";
import { fractionToPercent } from "@/utils";

type SegmentPaneProps = {
  width: number;
  componentIterator: MeasureComponentIterator;
  componentFractions: MeasureComponentValues;
  onComponentClick: (yPos: number) => void;
};

const SegmentPane: FunctionComponent<SegmentPaneProps> = ({
  width,
  componentIterator,
  componentFractions,
  onComponentClick,
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
      style={{ "--width": fractionToPercent(width) } as CSSProperties}
    >
      {components}
    </div>
  );
};

export default SegmentPane;
