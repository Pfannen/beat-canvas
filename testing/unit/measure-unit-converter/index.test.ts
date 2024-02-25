import { MeasureUnitConverter } from "../../../objects/music/measure-unit-converter";
import MeasurePositions from "../../../objects/music/note-position";

const componentCount = 19;
const componentsBelowBody = 5;
const segmentFraction = 0.25;
const height = 1;
const startsWithLine = false;

const positions = new MeasurePositions(
  componentCount,
  componentsBelowBody,
  segmentFraction,
  height,
  startsWithLine
);

const widthHeightRatio = 4 / 3;

const unitConverter = new MeasureUnitConverter({
  widthHeightRatio,
  segmentFraction,
  height,
  getYOffset: positions.getYOffset,
  componentFractions: positions.heights,
});

//#region xPosition

test("From xPos to height to width", () => {
  const xPos = 2;
  const width = 0.5 * unitConverter.convert("height", "width", height);

  const xPosHeight = unitConverter.convert("xPos", "height", xPos);

  const widthHeight = unitConverter.convert("width", "height", width);
  expect(xPosHeight).toBe(widthHeight);
});

const getXPositionWidth = (xPos: number) => {
  const widthFraction = xPos * segmentFraction;
  return widthFraction * unitConverter.convert("height", "width", height);
};

test("From width to xPos", () => {
  //Example: segmentFraction = .25, --> i < 4, i += .25 (range is from 0 - 4 with .25 increments)
  for (let i = 0; i < 1 / segmentFraction; i += segmentFraction) {
    const width = getXPositionWidth(i);

    const xPos = unitConverter.convert("width", "xPos", width);

    expect(xPos).toBeCloseTo(i);
  }
});

//#endregion

//#region height

test("From height to width", () => {
  const height = 3;
  const width = unitConverter.convert("height", "width", height);
  expect(width).toBe(4);
});

//#endregion
