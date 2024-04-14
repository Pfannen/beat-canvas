import { Measure } from "@/components/providers/music/types";
import classes from "./index.module.css";
import { FunctionComponent } from "react";
import useSplitSegmentRegistry from "@/components/hooks/useSplitSegement/useSplitSegmentRegistry";
import MeasureSegments from "./measure-segments";

type SegmentedMeasuresProps = {
  measures: Measure[];
};

const SegmentedMeasures: FunctionComponent<SegmentedMeasuresProps> = ({
  measures,
}) => {
  const registry = useSplitSegmentRegistry();
  return (
    <div className={classes.measures}>
      {measures.map((measure) => (
        <div className={classes.measure}>
          <MeasureSegments
            splitSegementRegistry={registry}
            onSegmentClick={registry.splitSegment}
            onSegmentAuxClick={registry.joinSegment}
            measure={measure}
          />
        </div>
      ))}
    </div>
  );
};

export default SegmentedMeasures;
