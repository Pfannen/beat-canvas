"use client";
import classes from "./index.module.css";
import { FunctionComponent, ReactNode } from "react";
import { Segment, SegmentGenerator, SegmentRenderer } from "../types";
import {
  TimeSignature,
  Note,
  SegmentBeat,
} from "@/components/providers/music/types";
import { getNoteDuration } from "@/components/providers/music/utils";
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
