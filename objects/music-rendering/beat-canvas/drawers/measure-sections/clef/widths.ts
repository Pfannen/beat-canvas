import { Clef } from "@/types/music";
import { getClefAspectRatio } from "./clef-svgs";

export const getClefWidth = (clef: Clef, bodyHeight: number) => {
  const aspectRatio = getClefAspectRatio(clef);
  return aspectRatio * bodyHeight;
};
