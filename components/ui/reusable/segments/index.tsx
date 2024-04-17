"use client";

import { FunctionComponent } from "react";
import { SegmentGenerator, SegmentRenderer } from "../../measure/types";
import { TimeSignature, Measure } from "@/components/providers/music/types";
import { measuresToSegmentArray } from "@/utils/segments/measuresToSegments";

export type SegmentsProps = {
  segmentGenerator: SegmentGenerator;
  renderSegment: SegmentRenderer;
  measure: Measure;
  timeSignature: TimeSignature;
};

const Segments: FunctionComponent<SegmentsProps> = ({
  segmentGenerator,
  renderSegment,
  measure,
  timeSignature,
}) => {
  const segments = measuresToSegmentArray(segmentGenerator, [measure], 0);
  return (
    <>
      {segments.map((segment) => {
        const { beatPercentage, noteIndices, xPos } = segment;
        return renderSegment({
          beatPercentage,
          noteIndices,
          xPos,
          width: beatPercentage / timeSignature.beatsPerMeasure,
        });
      })}
    </>
  );
};

export default Segments;
