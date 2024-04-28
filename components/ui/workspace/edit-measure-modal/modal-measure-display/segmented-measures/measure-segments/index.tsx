import classes from "./index.module.css";
import { Measure } from "@/components/providers/music/types";
import { FunctionComponent } from "react";
import Segments from "@/components/ui/reusable/segments";
import { minimalSegmentGenerator } from "@/utils/segments/segment-gen-1";
import SplitSegment, {
  SplitSegmentComponentProps,
} from "@/components/ui/reusable/split-segment";
import {
  MeasureComponentIterator,
  MeasureComponentValues,
} from "@/types/music-rendering";
import SegmentPane from "../../segment-pane";
import { Coordinate } from "@/types";

type MeasureSegmentsProps = {
  measure: Measure;
  onSegmentClick: (location: Coordinate, noteIndices?: number[]) => void;
  componentIterator: MeasureComponentIterator;
  componentFractions: MeasureComponentValues;
  noteContainerHeight: number;
  isSegmentSelected: (xPos: number) => boolean;
  canSegmentSplit: (xPos: number) => boolean;
  isYPosSelected: (x: number, y: number) => boolean;
};

const MeasureSegments: FunctionComponent<MeasureSegmentsProps> = ({
  measure,
  onSegmentClick,
  componentIterator,
  componentFractions,
  noteContainerHeight,
  isSegmentSelected,
  canSegmentSplit,
  isYPosSelected,
}) => {
  const getComponent =
    (noteIndices?: number[]) =>
    (xPos: number) =>
    (props: SplitSegmentComponentProps) => {
      return (
        <SegmentPane
          {...props}
          componentIterator={componentIterator}
          componentFractions={componentFractions}
          onComponentClick={(yPos) => {
            onSegmentClick({ x: xPos, y: yPos }, noteIndices);
          }}
          isYPosSelected={isYPosSelected.bind(null, xPos)}
          noteContainerHeight={noteContainerHeight}
          isSelected={isSegmentSelected(xPos)}
        />
      );
    };
  return (
    <Segments
      segmentGenerator={minimalSegmentGenerator}
      measure={measure}
      timeSignature={{ beatNote: 4, beatsPerMeasure: 4 }}
      renderSegment={(props) => {
        return (
          <SplitSegment
            getComponent={getComponent(props.noteIndices)}
            rightSiblingIdentifier={props.xPos + props.beatPercentage}
            identifier={props.xPos}
            width={props.width}
            canSplit={!props.noteIndices}
            minWidth={0}
            getChildrenKeys={keyFn}
            isSplit={false}
            key={`${props.xPos}-${props.beatPercentage}`}
          />
        );
      }}
    ></Segments>
  );
};

export default MeasureSegments;

const keyFn = (parentXPos: number, rightSiblingXPos: number) => {
  const mid = (rightSiblingXPos - parentXPos) / 2 + parentXPos;
  return { left: parentXPos, right: mid };
};
