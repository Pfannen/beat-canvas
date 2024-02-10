import { SegmentBeat } from "@/components/providers/music/types";
import { SegmentCount, SegmentGenerator } from "../../measure/types";

export const minimalSegmentGenerator: SegmentGenerator = (
  currentPosition: number,
  notePosition: number
) => {
  const distance = notePosition - currentPosition; //The distance that needs to be covered
  const segmentCounts: SegmentCount[] = []; //The segments that will fill the distance
  let currentDistance = 0; //The total distance covered

  let currentBeat = 1 as SegmentBeat; //The segment length to start with
  while (currentDistance < distance) {
    //While the distance hasn't been fully covered
    const segmentCount = Math.floor((distance - currentDistance) / currentBeat); //How many whole segments can be placed in the current distance
    currentDistance += segmentCount * currentBeat; //The distance that the whole segments cover
    if (segmentCount) {
      segmentCounts.push({
        segmentBeat: currentBeat as SegmentBeat,
        count: segmentCount,
      }); //Add the segment to the list of counts
    }
    currentBeat /= 2; //Try the next biggest segment length
  }
  if (isDownBeat(currentPosition)) {
    segmentCounts.sort((a, b) => {
      return b.segmentBeat - a.segmentBeat;
    });
  } //Display the segments in decreasing order if the current position is on a downbeat
  return segmentCounts;
};

const isDownBeat = (currentPosition: number) => {
  return Math.floor(currentPosition) === currentPosition; //Is down beat if there is no fractional part of current position
};

const getIndexLength = (index: number) => {
  return 1 / Math.pow(2, index);
};
