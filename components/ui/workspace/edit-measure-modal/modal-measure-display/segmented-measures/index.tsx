import { Measure } from "@/components/providers/music/types";
import classes from "./index.module.css";
import { CSSProperties, FunctionComponent } from "react";
import MeasureSegments from "./measure-segments";
import {
  MeasureComponentIterator,
  MeasureComponentValues,
} from "@/types/music-rendering";
import { Coordinate } from "@/types";
import { PositionData } from "@/types/ui/music-modal";

type SegmentedMeasuresProps = {
  measures: Measure[];
  onPositionClick: (position: Coordinate, positionData: PositionData) => void;
  isSegmentSelected: (measureIndex: number, xPos: number) => boolean;
  componentIterator: MeasureComponentIterator;
  componentFractions: MeasureComponentValues;
  noteHeight: number;
  noteOffset: number;
};

const SegmentedMeasures: FunctionComponent<SegmentedMeasuresProps> = ({
  measures,
  onPositionClick,
  isSegmentSelected,
  componentIterator,
  componentFractions,
  noteHeight,
  noteOffset,
}) => {
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
            onSegmentClick={getSegmentClickDel(i)}
            componentFractions={componentFractions}
            measure={measure}
            componentIterator={componentIterator}
            noteContainerHeight={noteHeight}
            isSegmentSelected={(xPos) => isSegmentSelected(i, xPos)}
            canSegmentSplit={() => true}
          />
        </div>
      ))}
    </div>
  );
};

export default SegmentedMeasures;
