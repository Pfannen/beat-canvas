import { MeasureManager } from "@/objects/music-rendering/measure-manager";
import { getMusicLayout } from "./utils";
import { MeasureRenderData } from "@/types/music/render-data";
import { MusicDimensionParams } from "@/types/music-rendering/music-layout";
import {
  IMeasureWidthCalculator,
  MeasureDrawData,
} from "@/types/music-rendering";
import { MeasureWidthCalculator } from "@/objects/music-rendering/measure-manager/measure-width-calculator";

const createEmptyMeasures = (count: number): MeasureRenderData[] => {
  const measures: MeasureRenderData[] = [];
  for (let i = 0; i < count; i++) {
    measures[i] = { components: [] };
  }
  return measures;
};

const createMeasureManager = (
  measureCount: number,
  p?: Partial<MusicDimensionParams>,
  widthCalculator?: IMeasureWidthCalculator
) => {
  const measures = createEmptyMeasures(measureCount);
  const musicLayout = getMusicLayout(p);
  const wCalculator =
    widthCalculator ||
    new MeasureWidthCalculator(musicLayout.measureDimensions.width, {
      beatNote: 4,
      beatsPerMeasure: 4,
    });
  const getTimeSig = () => ({
    beatsPerMeasure: 4,
    beatNote: 4,
  });
  return new MeasureManager(measures, musicLayout, wCalculator, getTimeSig);
};

const testMeasureData = (
  drawData: Partial<MeasureDrawData>[],
  mm: MeasureManager
) => {
  drawData.forEach((expected, i) => {
    const measureData = mm.getMeasureData(i);
    expected.start !== undefined &&
      expect(measureData.start).toStrictEqual(expected.start);
    expected.end !== undefined &&
      expect(measureData.end).toStrictEqual(expected.end);
    expected.width !== undefined &&
      expect(measureData.width).toBe(expected.width);
    expected.aspectRatio !== undefined &&
      expect(measureData.aspectRatio).toBeCloseTo(expected.aspectRatio);
    expected.pageNumber !== undefined &&
      expect(measureData.pageNumber).toBe(expected.pageNumber);
  });
};

//#region Single Line
test("Single Measure", () => {
  const measureManager = createMeasureManager(1);

  measureManager.compute();
  const expected = {
    start: { x: 0, y: 0 },
    end: { x: 10, y: 0 },
    width: 10,
    aspectRatio: 1,
  };
  testMeasureData([expected], measureManager);
});

test("Two Measures", () => {
  const measureManager = createMeasureManager(2);

  measureManager.compute();
  const expected = [
    {
      start: { x: 0, y: 0 },
      end: { x: 10, y: 0 },
      width: 10,
      aspectRatio: 1,
    },
    { start: { x: 10, y: 0 }, end: { x: 20, y: 0 }, width: 10, aspectRatio: 1 },
  ];
  testMeasureData(expected, measureManager);
});
//#endregion

//#region Line Break
test("Line Break - Single Measure", () => {
  const mm = createMeasureManager(2, {
    pageDimensions: { width: 11, height: 11 },
    measuresPerLine: 1,
    linesPerPage: 2,
  });
  mm.compute();
  testMeasureData(
    [
      { width: 11, pageNumber: 1, start: { x: 0, y: 0 } },
      { width: 11, pageNumber: 1, start: { x: 0, y: 11 / 2 } },
    ],
    mm
  );
});

test("Line Break - Two Measures", () => {
  let mCount = 0;
  const widthCalc: IMeasureWidthCalculator = {
    getMeasureWidth: (_, __) => {
      mCount++;
      return mCount <= 2 ? 1 : 11;
    },
  };
  const mm = createMeasureManager(
    3,
    {
      pageDimensions: { width: 11, height: 11 },
      measuresPerLine: 2,
      linesPerPage: 2,
    },
    widthCalc
  );
  mm.compute();
  testMeasureData(
    [
      { width: 11 / 2, pageNumber: 1, start: { x: 0, y: 0 } },
      { width: 11 / 2, pageNumber: 1, start: { x: 11 / 2, y: 0 } },
      { width: 11, pageNumber: 1, start: { x: 0, y: 11 / 2 } },
    ],
    mm
  );
});
//#endregion

//#region Page Break
test("Page Break - Single Measure", () => {
  const mm = createMeasureManager(2, {
    pageDimensions: { width: 11, height: 11 },
    measuresPerLine: 1,
    linesPerPage: 1,
  });
  mm.compute();
  testMeasureData(
    [
      { width: 11, pageNumber: 1, start: { x: 0, y: 0 } },
      { width: 11, pageNumber: 2, start: { x: 0, y: 0 } },
    ],
    mm
  );
});

test("Page Break - Two Measures", () => {
  let mCount = 0;
  const widthCalc: IMeasureWidthCalculator = {
    getMeasureWidth: (_, __) => {
      mCount++;
      return mCount <= 2 ? 1 : 11;
    },
  };
  const mm = createMeasureManager(
    3,
    {
      pageDimensions: { width: 11, height: 11 },
      measuresPerLine: 2,
      linesPerPage: 1,
    },
    widthCalc
  );
  mm.compute();
  testMeasureData(
    [
      { width: 11 / 2, pageNumber: 1, start: { x: 0, y: 0 } },
      { width: 11 / 2, pageNumber: 1, start: { x: 11 / 2, y: 0 } },
      { width: 11, pageNumber: 2, start: { x: 0, y: 0 } },
    ],
    mm
  );
});
//#endregion
