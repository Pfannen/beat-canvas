"use client";
import classes from "./index.module.css";
import { FunctionComponent } from "react";
import { SegmentGenerator, SegmentRenderer } from "../types";
import { TimeSignature, Note } from "@/components/providers/music/types";
import { measuresToSegmentArray } from "@/utils/segments/measuresToSegments";

export type SegmentedMeasureProps = {
  segmentGenerator: SegmentGenerator;
  renderSegment: SegmentRenderer;
  notes: Note[];
  // addNote: (note: Note) => void;
  // removeNote: (xPos: number, yPos: number) => void;
  timeSignature: TimeSignature;
};

const SegmentedMeasure: FunctionComponent<SegmentedMeasureProps> = ({
  segmentGenerator,
  renderSegment,
  notes,
  timeSignature,
}) => {
  const segments = measuresToSegmentArray(segmentGenerator, [{ notes }], 0);
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

export default SegmentedMeasure;
