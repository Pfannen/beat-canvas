import {
  MusicDimensionData,
  MusicDimensionParams,
} from "@/types/music-rendering/music-layout";
import { PageDimensionParams } from "./page-dimension-params";
import {
  LINES_PER_PAGE,
  MEASURES_PER_LINE,
} from "@/constants/music-dimensions";

export class MusicLayout {
  static getDimensions(params: MusicDimensionParams): MusicDimensionData {
    const {
      pageDimensions,
      musicMargins,
      linesPerPage,
      measurePaddingFractions,
    } = params;
    const blockMargin = musicMargins.top + musicMargins.bottom;
    const inlineMargin = musicMargins.left + musicMargins.right;
    const contentHeight = pageDimensions.height - blockMargin;
    const contentWidth = pageDimensions.width - inlineMargin;

    const measureContainerHeight = contentHeight / linesPerPage;

    const measureContainerPaddingTop =
      measureContainerHeight * measurePaddingFractions.top;
    const mesaureContainerPaddingBottom =
      measureContainerHeight * measurePaddingFractions.bottom;

    const measureNoteStartYOffset = measureContainerPaddingTop;
    const measureNoteEndYOffset =
      measureContainerHeight - mesaureContainerPaddingBottom;
    const measureWidth = contentWidth / params.measuresPerLine;
    let firstPageLineCount =
      (contentHeight - params.minHeaderSpace) / measureContainerHeight;

    if (linesPerPage - firstPageLineCount < 0.1) {
      firstPageLineCount = Math.ceil(firstPageLineCount);
    } else {
      firstPageLineCount = Math.floor(firstPageLineCount);
    }
    const headerHeight =
      contentHeight - firstPageLineCount * measureContainerHeight;

    const measureStartX = musicMargins.left;
    const measureStartY =
      pageDimensions.height - musicMargins.top - headerHeight;

    return {
      measureDimensions: {
        padding: {
          top: measureContainerPaddingTop,
          bottom: mesaureContainerPaddingBottom,
        },
        noteYOffset: measureNoteStartYOffset,
        noteSpaceHeight: measureNoteEndYOffset - measureNoteStartYOffset,
        height: measureContainerHeight,
        width: measureWidth,
      },
      pageDimensions: {
        headerHeight,
        musicMargins,
        width: pageDimensions.width,
        height: pageDimensions.height,
        firstMeasureStart: {
          x: measureStartX,
          y: measureStartY,
        },
      },
    };
  }

  static getGenericSheetMusicDimensions() {
    return this.getDimensions(
      PageDimensionParams.genericSheetMusic(MEASURES_PER_LINE, LINES_PER_PAGE)
    );
  }

  static getMarginlessSheetMusic(
    width: number,
    height: number,
    linesPerPage = LINES_PER_PAGE,
    measuresPerLine = MEASURES_PER_LINE
  ) {
    return this.getDimensions(
      PageDimensionParams.marginlessSheetMusic(
        width,
        height,
        linesPerPage,
        measuresPerLine
      )
    );
  }
}
