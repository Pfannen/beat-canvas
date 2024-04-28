import { getClefAspectRatio } from "@/SVG/measure/clef";
import { Clef } from "@/types/music";

export const getClefWidth = (clef: Clef, bodyHeight: number) => {
  const aspectRatio = getClefAspectRatio(clef);
  return aspectRatio * bodyHeight;
};
