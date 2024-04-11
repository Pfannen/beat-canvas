import { Measure } from "@/components/providers/music/types";
import classes from "./index.module.css";
import { FunctionComponent } from "react";
import SegmentedContainer from "@/components/ui/reusable/segmented-container";
import { minimalSegmentGenerator } from "@/utils/segments/segment-gen-1";
import SplitSegment from "@/components/ui/reusable/split-segment";
import {
  RegistryDelegates,
  SplitJoinDel,
} from "@/components/hooks/useSplitSegement/useSplitSegmentRegistry";
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
  return (
    <SegmentedContainer
      segmentGenerator={minimalSegmentGenerator}
      measure={measure}
      timeSignature={{ beatNote: 4, beatsPerMeasure: 4 }}
      renderSegment={(props) => {
        return (
          <SplitSegment
            registryDelegates={splitSegementRegistry}
            segment={
              <SegmentPane
                onClick={onSegmentClick.bind(null, props.xPos)}
                width={props.width + "%"}
              />
            }
            identifier={props.xPos}
            width={0}
            canSplit={false}
            smallestWidth={0}
          />
        );
      }}
    ></SegmentedContainer>
  );
};

export default MeasureSegments;
