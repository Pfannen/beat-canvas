import { Margins, PageDimensions } from "@/types/music-rendering/pdf";
import { MusicDimensionParams } from "@/types/music-rendering/music-layout";
import { PageSizes } from "pdf-lib";

export class PageDimensionParams {
  static genericSheetMusic(): MusicDimensionParams {
    const pageSize = PageSizes.A4;
    const pageDimensions = { width: pageSize[0], height: pageSize[1] };
    return {
      pageDimensions,
      musicMargins: getMarginSize(pageDimensions, {
        top: "medium",
        bottom: "medium",
        left: "medium",
        right: "medium",
      }),
      minHeaderSpace: 0.15 * pageDimensions.height,
      measuresPerLine: 4,
      linesPerPage: 9,
      measurePaddingFractions: { top: 0.1, bottom: 0.2 },
    };
  }
}

type MarginSize = "small" | "medium" | "large";

const marginSizeToFraction: { [key in MarginSize]: number } = {
  small: 0.05,
  medium: 0.075,
  large: 0.1,
};

const getMarginSize = (
  pageDimensions: PageDimensions,
  size: Margins<MarginSize>
): Margins<number> => {
  const { width, height } = pageDimensions;
  const { top, bottom, left, right } = size;
  const topMargin = marginSizeToFraction[top] * height;
  const bottomMargin = marginSizeToFraction[bottom] * height;
  const leftMargin = marginSizeToFraction[left] * width;
  const rightMargin = marginSizeToFraction[right] * width;
  return {
    top: topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
};
