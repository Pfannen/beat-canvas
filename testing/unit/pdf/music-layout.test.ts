import { MusicLayout } from "@/objects/pdf/music-layout";
import { MusicDimensionParams } from "@/types/pdf/music-layout";

const getParams = (p?: Partial<MusicDimensionParams>) => {
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

test("No Margins, Padding, or Header", () => {
  const params = getParams();
  const { measureDimensions, pageDimensions } =
    MusicLayout.getDimensions(params);
  expect(measureDimensions.height).toBe(10);
  expect(measureDimensions.height).toBe(measureDimensions.noteSpaceHeight);
  expect(measureDimensions.width).toBe(10);
  expect(measureDimensions.noteYOffset).toBe(0);
  expect(measureDimensions.padding).toStrictEqual({ top: 0, bottom: 0 });

  expect(pageDimensions.firstMeasureStart).toStrictEqual({ x: 0, y: 0 });
  expect(pageDimensions.headerHeight).toBe(0);
});

test("Exact Header Space", () => {
  const params = getParams({ minHeaderSpace: 10 });
  const { measureDimensions, pageDimensions } =
    MusicLayout.getDimensions(params);
  expect(measureDimensions.height).toBe(10);
  expect(measureDimensions.height).toBe(measureDimensions.noteSpaceHeight);
  expect(measureDimensions.width).toBe(10);
  expect(measureDimensions.noteYOffset).toBe(0);
  expect(measureDimensions.padding).toStrictEqual({ top: 0, bottom: 0 });

  expect(pageDimensions.firstMeasureStart).toStrictEqual({ x: 0, y: 10 });
  expect(pageDimensions.headerHeight).toBe(10);
});

test("Rounded Header Space", () => {
  const params = getParams({ minHeaderSpace: 11 });
  const { measureDimensions, pageDimensions } =
    MusicLayout.getDimensions(params);
  expect(measureDimensions.height).toBe(10);
  expect(measureDimensions.height).toBe(measureDimensions.noteSpaceHeight);
  expect(measureDimensions.width).toBe(10);
  expect(measureDimensions.noteYOffset).toBe(0);
  expect(measureDimensions.padding).toStrictEqual({ top: 0, bottom: 0 });

  expect(pageDimensions.firstMeasureStart).toStrictEqual({ x: 0, y: 20 });
  expect(pageDimensions.headerHeight).toBe(20);
});

test("Page Margins", () => {
  const params = getParams({
    musicMargins: { top: 10, bottom: 10, left: 10, right: 10 },
  });
  const { measureDimensions, pageDimensions } =
    MusicLayout.getDimensions(params);
  expect(measureDimensions.height).toBe(8);
  expect(measureDimensions.height).toBe(measureDimensions.noteSpaceHeight);
  expect(measureDimensions.width).toBe(8);
  expect(measureDimensions.noteYOffset).toBe(0);
  expect(measureDimensions.padding).toStrictEqual({ top: 0, bottom: 0 });

  expect(pageDimensions.firstMeasureStart).toStrictEqual({ x: 10, y: 10 });
  expect(pageDimensions.headerHeight).toBe(0);
});

test("Page Margins and Measure Padding", () => {
  const params = getParams({
    musicMargins: { top: 10, bottom: 10, left: 10, right: 10 },
    measurePaddingFractions: { top: 0.1, bottom: 0.1 },
  });
  const { measureDimensions, pageDimensions } =
    MusicLayout.getDimensions(params);
  expect(measureDimensions.height).toBe(8);
  expect(measureDimensions.width).toBe(8);
  expect(measureDimensions.noteYOffset).toBe(0.8);
  expect(measureDimensions.noteSpaceHeight).toBe(6.4);
  expect(measureDimensions.padding).toStrictEqual({ top: 0.8, bottom: 0.8 });

  expect(pageDimensions.firstMeasureStart).toStrictEqual({ x: 10, y: 10 });
  expect(pageDimensions.headerHeight).toBe(0);
});
