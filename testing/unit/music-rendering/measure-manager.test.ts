import { MeasureManager } from "@/objects/music-rendering/measure-manager";
import { getMusicLayout } from "./utils";
import { MeasureRenderData } from "@/types/music/render-data";
import { MusicDimensionParams } from "@/types/music-rendering/music-layout";
import { MeasureDrawData } from "@/types/music-rendering";

const createEmptyMeasures = (count: number): MeasureRenderData[] => {
  const measures: MeasureRenderData[] = [];
  for (let i = 0; i < count; i++) {
    measures[i] = { components: [] };
  }
  return measures;
};

const createMeasureManager = (
  measureCount: number,
  p?: Partial<MusicDimensionParams>
) => {
  const measures = createEmptyMeasures(measureCount);
  const musicLayout = getMusicLayout(p);
  return new MeasureManager(measures, musicLayout, () => ({
    beatsPerMeasure: 4,
    beatNote: 4,
  }));
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
  });
};

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
