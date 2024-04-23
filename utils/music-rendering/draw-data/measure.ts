import { UnitConverter } from "@/types";
import { TimeSignatureDrawData } from "@/types/music-rendering/draw-data/measure";

export const getTimeSignatureDrawData = (
  timeSignature: number,
  startX: number,
  sectionWidth: number,
  yPosToAbsolute: UnitConverter<number, number>
): TimeSignatureDrawData => {
  const symbol = "b";
  const symbolYPositions = [4, 7, 3, 6];
  const widthPerSymbol = sectionWidth / symbolYPositions.length;
  let x = startX + widthPerSymbol / 2;
  const positions = symbolYPositions.map((yPos) => {
    const y = yPosToAbsolute(yPos);
    const coordinate = { x, y };
    x += widthPerSymbol;
    return coordinate;
  });
  return { symbol, positions }; //Ab
};
