import {
  MusicDimensionData,
  MusicDimensionParams,
} from "@/types/music-rendering/music-layout";

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
    const firstPageLineCount = Math.floor(
      (contentHeight - params.minHeaderSpace) / measureContainerHeight
    );
    const headerHeight =
      contentHeight - firstPageLineCount * measureContainerHeight;

    const measureStartX = musicMargins.left;
    const measureStartY = musicMargins.top + headerHeight;

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
}
