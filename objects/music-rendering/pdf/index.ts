import { Measure, Note } from "@/components/providers/music/types";
import { createPDFFromMeasures } from "@/utils/import-export/export-pdf";

export const drawPDF = async () => {
  const measures: Measure[] = [];
  measures.push({ notes: test2 });
  // measures.push({ notes: increasingDown });
  // measures.push({ notes: increasingUp });
  // measures.push({ notes: decreasingDown });
  // measures.push({ notes: decreasingUp });
  // measures.push({ notes: constantUp });
  // measures.push({ notes: constantDown });
  // measures.push({ notes: nonOrderedUp });
  // measures.push({ notes: nonOrderedDown });
  // measures.push({ notes: [] });
  // measures.push({ notes: test });
  // measures.push({ notes: test });
  // measures.push({ notes: increasingDown });
  // measures.push({ notes: test });

  return createPDFFromMeasures(measures);
};

const increasingDown: Note[] = [
  { x: 0, y: -8, type: "eighth" },
  { x: 0.5, y: 0, type: "eighth" },
  // { x: 0.5, y: 12, type: "sixteenth" },
  // { x: 0.75, y: 13, type: "eighth" },
];

const increasingUp: Note[] = [
  { x: 0, y: -3, type: "sixteenth" },
  { x: 0.25, y: 1, type: "sixteenth" },
  { x: 0.5, y: 2, type: "sixteenth" },
  { x: 0.75, y: 3, type: "sixteenth" },
];

const decreasingDown: Note[] = [
  { x: 0, y: 5, type: "sixteenth" },
  { x: 0.25, y: 4, type: "sixteenth" },
  { x: 0.5, y: -3, type: "sixteenth" },
  { x: 0.75, y: -4, type: "sixteenth" },
];

const decreasingUp: Note[] = [
  { x: 0, y: 10, type: "sixteenth" },
  { x: 0.25, y: 1, type: "sixteenth" },
  { x: 0.5, y: -1, type: "sixteenth" },
  { x: 0.75, y: -2, type: "sixteenth" },
];

const constantUp: Note[] = [
  { x: 0, y: 3, type: "sixteenth" },
  { x: 0.25, y: 3, type: "sixteenth" },
  { x: 0.5, y: 3, type: "sixteenth" },
  { x: 0.75, y: 3, type: "sixteenth" },
];

const constantDown: Note[] = [
  { x: 0, y: 4, type: "sixteenth" },
  { x: 0.25, y: 4, type: "sixteenth" },
  { x: 0.5, y: 4, type: "sixteenth" },
  { x: 0.75, y: 4, type: "sixteenth" },
];

const nonOrderedUp: Note[] = [
  { x: 0, y: 3, type: "sixteenth" },
  { x: 0.25, y: -4, type: "sixteenth" },
  { x: 0.5, y: -1, type: "sixteenth" },
  { x: 0.75, y: 3, type: "sixteenth" },
];

const nonOrderedDown: Note[] = [
  { x: 0, y: 6, type: "sixteenth" },
  { x: 0.25, y: 9, type: "sixteenth" },
  { x: 0.5, y: 7, type: "sixteenth" },
  { x: 0.75, y: 6, type: "sixteenth" },
];

const test: Note[] = [
  { x: 0, y: -2, type: "sixteenth" },
  { x: 0.25, y: -1, type: "eighth" },
  { x: 0.75, y: 4, type: "eighth" },
  { x: 1.25, y: 6, type: "sixteenth" },
];

const test2: Note[] = [
  { x: 0, y: -8, type: "eighth" },
  { x: 0.75, y: -7, type: "eighth" },
  // { x: 2, y: -6, type: "eighth" },
  // { x: 3, y: -5, type: "eighth" },
];
