import { Coordinate, UnitConverter } from "@/types";
import { KeySignatureDrawData } from "@/types/music-rendering/draw-data/measure";
import { iterateSection } from "../segment-calculation";

export const getKeySignatureDrawData = (
  keySignature: number,
  startX: number,
  sectionWidth: number,
  yPosToAbsolute: UnitConverter<number, number>
): KeySignatureDrawData => {
  const symbol = "b";
  const symbolYPositions = [4, 7, 3, 6];
  const widthPerSymbol = sectionWidth / symbolYPositions.length;
  const positions: Coordinate[] = [];
  iterateSection(
    sectionWidth,
    startX,
    symbolYPositions.length,
    true,
    (x, i) => {
      const y = yPosToAbsolute(symbolYPositions[i]);
      const coordinate = { x, y };
      x += widthPerSymbol;
      positions.push(coordinate);
    }
  );

  return { symbol, positions }; //Ab
};
