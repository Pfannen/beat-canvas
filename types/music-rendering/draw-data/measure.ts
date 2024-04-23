import { Coordinate } from "@/types";
import { Accidental } from "@/types/music";

export type TimeSignatureDrawData = {
  symbol: Accidental;
  positions: Coordinate[];
};

export type MeasureDisplayData = {
  timeSignature?: TimeSignatureDrawData;
};
