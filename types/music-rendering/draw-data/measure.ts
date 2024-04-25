import { Coordinate } from "@/types";
import {
  Accidental,
  MeasureSection,
  MeasureSectionMetadata,
} from "@/types/music";
import { CoordinateSection } from "../measure-manager/measure-outline";

export type MeasureSectionHandlerContext = {
  getYOffset: (yPos: number) => number;
  noteSpaceBottomY: number;
  noteSpaceHeight: number;
  bodyHeight: number;
};

export type MeasureSectionHandler<T extends MeasureSection> = (
  measureData: MeasureSectionMetadata[T],
  sectionData: CoordinateSection<any>,
  context: MeasureSectionHandlerContext
) => MeasureDisplayData[T];

export type MeasureSectionHandlers = {
  [K in MeasureSection]: MeasureSectionHandler<K>;
};

export type MeasureDisplayData = {
  keySignature: KeySignatureDrawData;
  timeSignature: undefined;
  clef: undefined;
  note: undefined;
  repeat: undefined;
};

export type KeySignatureDrawData = {
  symbol: Accidental;
  positions: Coordinate[];
};
