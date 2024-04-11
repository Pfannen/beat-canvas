"use client";

import classes from "./index.module.css";
import { FunctionComponent } from "react";
import { SegmentGenerator, SegmentRenderer } from "../../measure/types";
import { TimeSignature, Measure } from "@/components/providers/music/types";
import { measuresToSegmentArray } from "@/utils/segments/measuresToSegments";

export type SegmentedContainerProps = {
  segmentGenerator: SegmentGenerator;
  renderSegment: SegmentRenderer;
  measure: Measure;
  timeSignature: TimeSignature;
};

const SegmentedContainer: FunctionComponent<SegmentedContainerProps> = ({
  segmentGenerator,
  renderSegment,
  measure,
  timeSignature,
}) => {
  const segments = measuresToSegmentArray(segmentGenerator, [measure], 0);
  return (
    <div className={classes.measure}>
      {segments.map((segment) => {
        const { beatPercentage, notes, xPos } = segment;
        return renderSegment({
          beatPercentage,
          notes,
          xPos,
          width: beatPercentage / timeSignature.beatsPerMeasure,
        });
      })}
    </div>
  );
};

export default SegmentedContainer;
