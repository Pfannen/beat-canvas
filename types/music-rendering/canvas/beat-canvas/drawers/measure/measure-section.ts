import { IDrawingCanvas } from "../../../drawing-canvas";
import { UnitConverter } from "@/types";
import { Clef, MeasureSection, MeasureSectionMetadata } from "@/types/music";
import { MeasureComponentValues } from "@/types/music-rendering";
import { CoordinateSection } from "@/types/music-rendering/measure-manager/measure-outline";

export type MeasureSectionDrawerArgs<T extends MeasureSection> = {
  drawCanvas: IDrawingCanvas;
  bodyHeight: number;
  componentHeights: MeasureComponentValues;
  section: CoordinateSection<T>;
  data: MeasureSectionMetadata[T];
  yPosToAbsolute: UnitConverter<number, number>;
  clef: Clef;
};

export type MeasureSectionDrawer<T extends MeasureSection> = (
  args: MeasureSectionDrawerArgs<T>
) => void;

export type MeasureSectionDrawers = {
  [K in MeasureSection]: MeasureSectionDrawer<K>;
};

export type MeasureSectionWidthArgs = {
  bodyHeight: number;
  componentHeights: MeasureComponentValues;
  clef: Clef;
};

export type MeasureSectionWidthHandlers = {
  [K in MeasureSection]: (
    args: MeasureSectionWidthArgs,
    data: MeasureSectionMetadata[K]
  ) => number;
};

export type MeasureSectionInfo<T extends MeasureSection> = {
  key: T;
  data: MeasureSectionMetadata[T];
};

export type InitialMeasureSection<T extends MeasureSection> = {
  displayByDefault: boolean;
} & MeasureSectionInfo<T>;

export type InitialMeasureSectionArray =
  InitialMeasureSection<MeasureSection>[];
