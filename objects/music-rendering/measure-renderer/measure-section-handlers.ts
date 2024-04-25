import { TimeSignature } from "@/components/providers/music/types";
import { Coordinate, UnitConverter } from "@/types";
import { Clef, MeasureSection, Repeat } from "@/types/music";
import {
  KeySignatureDrawData,
  MeasureSectionHandlerContext,
  MeasureSectionHandlers,
} from "@/types/music-rendering/draw-data/measure";
import { CoordinateSection } from "@/types/music-rendering/measure-manager/measure-outline";
import { iterateSection } from "@/utils/music-rendering/segment-calculation";

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

const handlers: MeasureSectionHandlers = {
  keySignature: (data, section, ctx) => {
    return getKeySignatureDrawData(
      data,
      section.startX,
      section.width,
      (yPos: number) =>
        ctx.getYOffset(yPos) * ctx.noteSpaceHeight + ctx.noteSpaceBottomY
    );
  },
  clef: function (
    measureData: Clef,
    sectionData: CoordinateSection<any>,
    context: MeasureSectionHandlerContext
  ): undefined {},
  timeSignature: function (
    measureData: TimeSignature,
    sectionData: CoordinateSection<any>,
    context: MeasureSectionHandlerContext
  ): undefined {},
  repeat: function (
    measureData: Repeat | undefined,
    sectionData: CoordinateSection<any>,
    context: MeasureSectionHandlerContext
  ): undefined {},
  note: function (
    measureData: undefined,
    sectionData: CoordinateSection<any>,
    context: MeasureSectionHandlerContext
  ): undefined {},
};

export const getMeasureSectionHandler = (section: MeasureSection) => {
  return handlers[section];
};
