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
  onSegmentClick: (location: Coordinate) => void;
  onSegmentAuxClick: (xPos: number) => void;
  componentIterator: MeasureComponentIterator;
  componentFractions: MeasureComponentValues;
  splitSegementRegistry: RegistryDelegates;
};

const MeasureSegments: FunctionComponent<MeasureSegmentsProps> = ({
  measure,
  onSegmentClick,
  onSegmentAuxClick,
  componentIterator,
  componentFractions,
  splitSegementRegistry,
}) => {
  const getComponentProps = (xPos: number) => {
    return {
      onComponentClick: (yPos: number) => {
        onSegmentClick({ x: xPos, y: yPos });
      },
      onAuxClick: () => {
        onSegmentAuxClick(xPos);
      },
      componentIterator: componentIterator,
      componentFractions: componentFractions,
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
            canSplit={!props.notes}
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
