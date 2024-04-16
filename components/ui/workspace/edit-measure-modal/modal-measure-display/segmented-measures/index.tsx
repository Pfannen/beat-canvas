import { Measure } from "@/components/providers/music/types";
import classes from "./index.module.css";
import { CSSProperties, FunctionComponent } from "react";
import useSplitSegmentRegistry from "@/components/hooks/useSplitSegement/useSplitSegmentRegistry";
import MeasureSegments from "./measure-segments";
import {
  MeasureComponentIterator,
  MeasureComponentValues,
} from "@/types/music-rendering";
import { Coordinate } from "@/objects/measurement/types";

type SegmentedMeasuresProps = {
  measures: Measure[];
  onSegmentClick: (location: Coordinate) => void;
  componentIterator: MeasureComponentIterator;
  componentFractions: MeasureComponentValues;
  noteHeight: number;
  noteOffset: number;
};

const SegmentedMeasures: FunctionComponent<SegmentedMeasuresProps> = ({
  measures,
  onSegmentClick,
  componentIterator,
  componentFractions,
  noteHeight,
  noteOffset,
}) => {
  const registry = useSplitSegmentRegistry();
  return (
    <div className={classes.measures}>
      {measures.map((measure) => (
        <div
          className={classes.measure}
          style={{ "--offset": noteOffset + "%" } as CSSProperties}
        >
          <MeasureSegments
            splitSegementRegistry={registry}
            onSegmentClick={onSegmentClick}
            componentFractions={componentFractions}
            onJoin={registry.joinSegment}
            onSplit={registry.splitSegment}
            measure={measure}
            componentIterator={componentIterator}
            noteContainerHeight={noteHeight}
          />
        </div>
      ))}
    </div>
  );
};

export default SegmentedMeasures;
