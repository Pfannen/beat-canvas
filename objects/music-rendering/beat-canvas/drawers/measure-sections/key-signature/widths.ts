import { getAccidentalSVG } from "@/SVG/measure/key-signature";
import { Accidental, Clef } from "@/types/music";
import { AccidentalSVG } from "@/types/svg/music";
import { getYPositionsForKeySignature } from "@/utils/music/key-signature";
import { getSVGAspectRatio } from "@/utils/svg";

export const getKeySignatureSymbol = (keySignature: number): Accidental =>
  keySignature < 0 ? "b" : "#";

//spaceHeight is the height of a space in the measure
export const getAccidentalWidth = (
  accidental: Accidental,
  spaceHeight: number
) => {
  const svg = getAccidentalSVG(accidental);
  return getWidthForAccidentalSVG(svg, spaceHeight);
};

export const getWidthForAccidentalSVG = (
  accidental: AccidentalSVG,
  spaceHeight: number
) => {
  const { viewBox } = accidental;
  const height = getHeightForAccidentalSVG(accidental, spaceHeight);
  const aspectRatio = getSVGAspectRatio(viewBox);
  return aspectRatio * height;
};

export const getHeightForAccidentalSVG = (
  accidental: AccidentalSVG,
  spaceHeight: number
) => {
  const { fractionOfSpaceHeight } = accidental;
  return fractionOfSpaceHeight * spaceHeight;
};

export const getKeySignatureWidth = (
  keySignature: number,
  clef: Clef,
  spaceHeight: number
) => {
  const positions = getYPositionsForKeySignature(keySignature, clef);
  const symbol = getKeySignatureSymbol(keySignature);
  const symbolWidth = getAccidentalWidth(symbol, spaceHeight);
  return positions.length * symbolWidth;
};

export const getKeySignatureData = (
  keySignature: number,
  clef: Clef,
  spaceHeight: number
) => {
  const positions = getYPositionsForKeySignature(keySignature, clef);
  const symbol = getKeySignatureSymbol(keySignature);
  const symbolWidth = getAccidentalWidth(symbol, spaceHeight);
  return { positions, symbolWidth, symbol };
};
