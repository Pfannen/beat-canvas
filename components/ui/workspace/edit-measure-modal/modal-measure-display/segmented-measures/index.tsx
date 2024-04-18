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
import { PositionData } from "@/types/ui/music-modal";

type SegmentedMeasuresProps = {
  measures: Measure[];
  onPositionClick: (position: Coordinate, positionData: PositionData) => void;
  componentIterator: MeasureComponentIterator;
  componentFractions: MeasureComponentValues;
  noteHeight: number;
  noteOffset: number;
};

const SegmentedMeasures: FunctionComponent<SegmentedMeasuresProps> = ({
  measures,
  onPositionClick,
  componentIterator,
  componentFractions,
  noteHeight,
  noteOffset,
}) => {
  const registry = useSplitSegmentRegistry();
  const getSegmentClickDel =
    (measureIndex: number) =>
    (position: Coordinate, noteIndices?: number[]) => {
      onPositionClick(position, { measureIndex, noteIndices });
    };
  return (
    <div className={classes.measures}>
      {measures.map((measure, i) => (
        <div
          className={classes.measure}
          style={{ "--offset": noteOffset + "%" } as CSSProperties}
        >
          <MeasureSegments
            splitSegementRegistry={registry}
            onSegmentClick={getSegmentClickDel(i)}
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
