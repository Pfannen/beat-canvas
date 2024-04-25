import { Accidental } from "@/types/music";

const accidentalFractions: { [K in Accidental]: number } = {
  b: 1.2,
  "#": 1.2,
  n: 1.3,
};

const getAccidentalSpaceFraction = (accidental: Accidental) => {
  return accidentalFractions[accidental];
};

const getKeySignaturePositions = (keySignature: number) => [4, 7, 3, 6];

export const getKeySignatureSymbol = (keySignature: number): Accidental => "n";

//spaceHeight is the height of a space in the measure
export const getAccidentalWidth = (
  accidental: Accidental,
  spaceHeight: number
) => {
  const spaceFraction = getAccidentalSpaceFraction(accidental);
  return spaceFraction * spaceHeight;
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
