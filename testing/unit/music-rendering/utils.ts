import { MeasureManager } from "@/objects/music-rendering/measure-manager";
import { MusicLayout } from "@/objects/music-rendering/music-layout";
import { MusicDimensionParams } from "@/types/music-rendering/music-layout";

/// By default returns a 100x100 page with 0 margins, 10 lines per page, 10 measures per line (10x10 measures) */
export const getMusicDimensionParams = (p?: Partial<MusicDimensionParams>) => {
  const params = {
    pageDimensions: p?.pageDimensions || { width: 100, height: 100 },
    musicMargins: p?.musicMargins || { top: 0, bottom: 0, left: 0, right: 0 },
    minHeaderSpace: p?.minHeaderSpace || 0,
    measuresPerLine: p?.measuresPerLine || 10,
    linesPerPage: p?.linesPerPage || 10,
    measurePaddingFractions: p?.measurePaddingFractions || {
      top: 0,
      bottom: 0,
    },
  };
  return params;
};

export const getMusicLayout = (p?: Partial<MusicDimensionParams>) => {
  return MusicLayout.getDimensions(getMusicDimensionParams(p));
};
