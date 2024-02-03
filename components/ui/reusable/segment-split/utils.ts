import { SegmentBeat, SegmentGenerator, SegmentMap } from "../../measure/types";

export const getSplitSegmentValues: SegmentGenerator = (
  currentPosition: number,
  notePosition: number
) => {
  const distance = notePosition - currentPosition;
  const segments: SegmentMap = {};
  let currentDistance = 0;
  let currentBeat: SegmentBeat = 1;
  while (currentDistance < distance) {
    const numberOfSegment = Math.floor(
      (distance - currentDistance) / currentBeat
    );
    currentDistance += numberOfSegment * currentBeat;
    segments[currentBeat as SegmentBeat] = numberOfSegment;
    currentBeat /= 2;
  }
  return {
    segments,
    segmentOrder: isDownBeat(currentPosition) ? "decreasing" : "increasing",
  };
};

const getIndexLength = (index: number) => {
  return 1 / Math.pow(2, index);
};

const isDownBeat = (currentPosition: number) => {
  return Math.floor(currentPosition) === currentPosition; //No fractional part of current position
};
