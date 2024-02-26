import { MeasureUnitConverter } from "../../../objects/measurement/measure-unit-converter";
import MeasurePositions from "../../../objects/measurement/note-position";

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

const measureWidth = height * widthHeightRatio;

//#region xPosition
test("From xPos to width", () => {
  //Example: segmentFraction = .25, --> i < 4, i += .25 (range is from 0 - 4 with .25 increments)
  for (let i = 0; i < 1 / segmentFraction; i += segmentFraction) {
    const expectedWidth = i * segmentFraction * measureWidth;
    const width = unitConverter.convert("xPos", "measureUnit", i);

    const percentOfWidth = unitConverter.percentOfWidth(width);
    const expectedPercentOfWidth = i * segmentFraction;

    expect(width).toBeCloseTo(expectedWidth);
    expect(percentOfWidth).toBeCloseTo(expectedPercentOfWidth);
  }
});

test("From xPos to xPos", () => {
  for (let i = 0; i < 4; i += 0.25) {
    expect(unitConverter.convert("xPos", "xPos", i)).toBeCloseTo(i);
  }
});

test("From measureUnit to xPos", () => {
  let expectedXPos = 1 / segmentFraction; // 4 if segmentFraction is .25
  let xPos = unitConverter.convert("measureUnit", "xPos", measureWidth);
  expect(xPos).toBe(expectedXPos);

  expectedXPos *= 2;
  xPos = unitConverter.convert("measureUnit", "xPos", measureWidth * 2);
  expect(xPos).toBe(expectedXPos);
});

//#endregion

//#region yPos
test("From yPos to height", () => {
  const yPos = 4;
  const height = unitConverter.convert("yPos", "measureUnit", yPos);
  expect(height).toBe(0.5);
});

test("From yPos to width percent", () => {
  const yPos = 4; //Center of the measure (1/2 of the measure height)
  const expectedWidthPercent = 0.5 / measureWidth;
  const measureUnitValue = unitConverter.convert("yPos", "measureUnit", yPos);
  const percentOfWidth = unitConverter.percentOfWidth(measureUnitValue);
  expect(percentOfWidth).toBe(expectedWidthPercent);
});

test("From yPos to xPos", () => {
  const yPos = 4; //Center of the measure (1/2 of the measure height)
  const expectedHeightPercent = 0.5;
  const xPos = unitConverter.convert("yPos", "xPos", yPos);
  const xPosMeasureUnit = unitConverter.convert("xPos", "measureUnit", xPos);
  const percentOfHeight = unitConverter.percentOfHeight(xPosMeasureUnit);
  console.log(xPos);
  expect(percentOfHeight).toBe(expectedHeightPercent);
});
//#endregion
