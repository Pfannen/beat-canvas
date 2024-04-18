import classes from "./index.module.css";
import { Measure } from "@/components/providers/music/types";
import { FunctionComponent } from "react";
import Segments from "@/components/ui/reusable/segments";
import { minimalSegmentGenerator } from "@/utils/segments/segment-gen-1";
import SplitSegment from "@/components/ui/reusable/split-segment";
import { RegistryDelegates } from "@/components/hooks/useSplitSegement/useSplitSegmentRegistry";
import {
  MeasureComponentIterator,
  MeasureComponentValues,
} from "@/types/music-rendering";
import SegmentPane from "../../segment-pane";
import { Coordinate } from "@/objects/measurement/types";

type MeasureSegmentsProps = {
  measure: Measure;
  onSegmentClick: (location: Coordinate, noteIndices?: number[]) => void;
  onSplit: (xPos: number) => void;
  onJoin: (xPos: number) => void;
  componentIterator: MeasureComponentIterator;
  componentFractions: MeasureComponentValues;
  splitSegementRegistry: RegistryDelegates;
  noteContainerHeight: number;
};

const MeasureSegments: FunctionComponent<MeasureSegmentsProps> = ({
  measure,
  onSegmentClick,
  componentIterator,
  onSplit,
  onJoin,
  componentFractions,
  splitSegementRegistry,
  noteContainerHeight,
}) => {
  const getComponentProps = (noteIndices?: number[]) => (xPos: number) => {
    return {
      onComponentClick: (yPos: number) => {
        onSegmentClick({ x: xPos, y: yPos }, noteIndices);
      },
      onSplit: onSplit.bind(null, xPos),
      onJoin: onJoin.bind(null, xPos),
      componentIterator: componentIterator,
      componentFractions: componentFractions,
      noteContainerHeight,
      width: 1,
    };
  };
  return (
    <Segments
      segmentGenerator={minimalSegmentGenerator}
      measure={measure}
      timeSignature={{ beatNote: 4, beatsPerMeasure: 4 }}
      renderSegment={(props) => {
        if (props.noteIndices) console.log(props.xPos);
        return (
          <SplitSegment
            as={SegmentPane}
            getComponentProps={getComponentProps(props.noteIndices)}
            rightSiblingIdentifier={props.xPos + props.beatPercentage}
            registryDelegates={splitSegementRegistry}
            identifier={props.xPos}
            width={props.width}
            canSplit={!props.noteIndices}
            minWidth={0}
            getChildrenKeys={keyFn}
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
