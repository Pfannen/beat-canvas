import { MeasureComponentValues } from "@/types/music-rendering";
import { DisplayDataAttacher } from "./types";

export const attachNonBodyData =
  (): DisplayDataAttacher =>
  ({ music, noteDisplayData, measureIndex, measurements }) => {
    const notes = music.getMeasureNotes(measureIndex);
    const measureComponents = measurements.getMeasureComponents();
    notes.forEach((note, i) => {
      const counts = measureComponents.getNonBodyComponentCounts(note.y);
      if (counts) {
        const isOnLine = measureComponents.yPosIsOnLine(note.y);
        noteDisplayData[i].nonBodyData = { numLines: counts.line, isOnLine };
        noteDisplayData[i].stemOffset += calculateStemOffset(
          counts,
          measurements.getComponentHeights()
        );
      }
    });
  };

const calculateStemOffset = (
  counts: MeasureComponentValues,
  heights: MeasureComponentValues
) => {
  return (
    Math.max(counts.space - 2, 0) * heights.space +
    Math.max(counts.line - 1, 0) * heights.line
  );
};
