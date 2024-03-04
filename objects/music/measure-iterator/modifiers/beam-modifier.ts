import { Note } from "@/components/providers/music/types";

const attachBeamData = (measureNotes: Note[]) => {};

const noteIsInDivision = (
  x: number,
  duration: number,
  subdivisionLength: number,
  currentSubdivision: number
) => {
  const { start, end } = noteStartEndDivisions(x, duration, subdivisionLength);
  if (start === end) return start === currentSubdivision;
  return false;
};

const noteStartEndDivisions = (
  x: number,
  duration: number,
  subdivisionLength: number
) => {
  const start = Math.floor(x / subdivisionLength);
  const end = Math.floor((x + duration) / subdivisionLength);
  return { start, end };
};
