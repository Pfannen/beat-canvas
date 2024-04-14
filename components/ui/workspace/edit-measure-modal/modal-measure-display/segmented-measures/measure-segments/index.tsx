import { Measure } from "@/components/providers/music/types";
import classes from "./index.module.css";
import { FunctionComponent } from "react";
import Segments from "@/components/ui/reusable/segments";
import { minimalSegmentGenerator } from "@/utils/segments/segment-gen-1";
import SplitSegment from "@/components/ui/reusable/split-segment";
import { RegistryDelegates } from "@/components/hooks/useSplitSegement/useSplitSegmentRegistry";
import SegmentPane from "./segment-pane";

type MeasureSegmentsProps = {
  measure: Measure;
  onSegmentClick: (xPos: number) => void;
  splitSegementRegistry: RegistryDelegates;
};

const MeasureSegments: FunctionComponent<MeasureSegmentsProps> = ({
  measure,
  onSegmentClick,
  splitSegementRegistry,
}) => {
  const getComponentProps = (xPos: number) => {
    return {
      onClick: () => {
        onSegmentClick(xPos);
      },
      width: 1,
    };
  };
  return (
    <Segments
      segmentGenerator={minimalSegmentGenerator}
      measure={measure}
      timeSignature={{ beatNote: 4, beatsPerMeasure: 4 }}
      renderSegment={(props) => {
        return (
          <SplitSegment
            as={SegmentPane}
            getComponentProps={getComponentProps}
            rightSiblingIdentifier={props.xPos + props.beatPercentage}
            registryDelegates={splitSegementRegistry}
            identifier={props.xPos}
            width={props.width}
            canSplit={true}
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
