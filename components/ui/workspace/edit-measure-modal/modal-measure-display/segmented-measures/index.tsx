import { Measure } from "@/components/providers/music/types";
import classes from "./index.module.css";
import { FunctionComponent } from "react";
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
};

const SegmentedMeasures: FunctionComponent<SegmentedMeasuresProps> = ({
  measures,
  onSegmentClick,
  componentIterator,
  componentFractions,
}) => {
  const registry = useSplitSegmentRegistry();
  const segmentClickHandler = (location: Coordinate) => {
    registry.splitSegment(location.x);
    onSegmentClick(location);
  };
  return (
    <div className={classes.measures}>
      {measures.map((measure) => (
        <div className={classes.measure}>
          <MeasureSegments
            splitSegementRegistry={registry}
            onSegmentClick={segmentClickHandler}
            componentFractions={componentFractions}
            onSegmentAuxClick={registry.joinSegment}
            measure={measure}
            componentIterator={componentIterator}
          />
        </div>
      ))}
    </div>
  );
};

export default SegmentedMeasures;
