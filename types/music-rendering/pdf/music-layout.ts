import { BlockDirection, Margins, PageDimensions } from ".";

export type MusicDimensionParams = {
  pageDimensions: PageDimensions;
  musicMargins: Margins;
  minHeaderSpace: number;
  measuresPerLine: number;
  linesPerPage: number;
  measurePaddingFractions: BlockDirection<number>;
};
