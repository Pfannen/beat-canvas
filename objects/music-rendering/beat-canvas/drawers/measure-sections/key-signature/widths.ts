import { getAccidentalSVG } from "@/SVG/measure/key-signature";
import { Accidental } from "@/types/music";
import { AccidentalSVG } from "@/types/svg/music";
import { getSVGAspectRatio } from "@/utils/svg";

const getKeySignaturePositions = (keySignature: number) => [4, 7, 3, 6];

export const getKeySignatureSymbol = (keySignature: number): Accidental => "#";

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
  spaceHeight: number
) => {
  const positions = getKeySignaturePositions(keySignature);
  const symbol = getKeySignatureSymbol(keySignature);
  const symbolWidth = getAccidentalWidth(symbol, spaceHeight);
  return positions.length * symbolWidth;
};

export const getKeySignatureData = (
  keySignature: number,
  spaceHeight: number
) => {
  const positions = getKeySignaturePositions(keySignature);
  const symbol = getKeySignatureSymbol(keySignature);
  const symbolWidth = getAccidentalWidth(symbol, spaceHeight);
  return { positions, symbolWidth, symbol };
};
