import { NoteBeamCalculator } from "../../../objects/measurement/note-beam-calculator";
import { Coordinate } from "../../../objects/measurement/types";

const expectedHypotenuse = (sideOne: number, sideTwo: number) =>
  Math.sqrt(Math.pow(sideOne, 2) + Math.pow(sideTwo, 2));

//#region beam angles and lengths
test("Increasing notes - simple", () => {
  const pointOne: Coordinate = { x: 0, y: 0 };
  const pointTwo: Coordinate = { x: 2, y: 2 };
  const data = NoteBeamCalculator.calculateEndpointData(pointOne, pointTwo);
  expect(data.beamAngle).toBe(45);
  expect(data.beamLength).toBe(expectedHypotenuse(2, 2));
});

test("Increasing notes - challenge", () => {
  const pointOne: Coordinate = { x: 0, y: 0 };
  const pointTwo: Coordinate = { x: 2, y: 2 };
  const data = NoteBeamCalculator.calculateEndpointData(pointOne, pointTwo);
  expect(data.beamAngle).toBe(45);
  expect(data.beamLength).toBe(expectedHypotenuse(2, 2));
});

test("Decreasing notes", () => {
  const pointOne: Coordinate = { x: 0, y: 2 };
  const pointTwo: Coordinate = { x: 2, y: 0 };
  const data = NoteBeamCalculator.calculateEndpointData(pointOne, pointTwo);
  expect(data.beamAngle).toBe(135);
  expect(data.beamLength).toBe(expectedHypotenuse(2, 2));
});

test("Equal notes", () => {
  const pointOne: Coordinate = { x: 0, y: 2 };
  const pointTwo: Coordinate = { x: 2, y: 2 };
  const data = NoteBeamCalculator.calculateEndpointData(pointOne, pointTwo);
  expect(data.beamAngle).toBe(90);
  expect(data.beamLength).toBe(2);
});
//#endregion

//#region Beam Treshold Simple Cases
test("Increasing notes with threshold", () => {
  const pointOne: Coordinate = { x: 0, y: 0 };
  const pointTwo: Coordinate = { x: 2, y: 2 };
  const data = NoteBeamCalculator.calculateEndpointData(pointOne, pointTwo);
  const thresholdData = NoteBeamCalculator.calculateThresholdData(
    pointOne,
    pointTwo,
    data.beamAngle
  );
  expect(thresholdData.beamLength).toBeCloseTo(data.beamLength);
  expect(thresholdData.y1Offset).toBeCloseTo(0);
  expect(thresholdData.y2Offset).toBeCloseTo(0);
});

test("Decreasing notes with threshold", () => {
  const pointOne: Coordinate = { x: 0, y: 2 };
  const pointTwo: Coordinate = { x: 2, y: 0 };
  const data = NoteBeamCalculator.calculateEndpointData(pointOne, pointTwo);
  const thresholdData = NoteBeamCalculator.calculateThresholdData(
    pointOne,
    pointTwo,
    data.beamAngle
  );

  expect(thresholdData.beamLength).toBeCloseTo(data.beamLength);
  expect(thresholdData.y1Offset).toBeCloseTo(0);
  expect(thresholdData.y2Offset).toBeCloseTo(0);
});

test("Equal notes with threshold", () => {
  const pointOne: Coordinate = { x: 0, y: 2 };
  const pointTwo: Coordinate = { x: 2, y: 2 };
  const data = NoteBeamCalculator.calculateEndpointData(pointOne, pointTwo);
  const thresholdData = NoteBeamCalculator.calculateThresholdData(
    pointOne,
    pointTwo,
    data.beamAngle
  );

  expect(thresholdData.beamLength).toBeCloseTo(data.beamLength);
  expect(thresholdData.y1Offset).toBeCloseTo(0);
  expect(thresholdData.y2Offset).toBeCloseTo(0);
});
//#endregion

//#region Beam Treshold Theoretical Cases (shouldn't actually appear)
test("Increasing notes with threshold and offset", () => {
  const pointOne: Coordinate = { x: 0, y: 0 };
  const pointTwo: Coordinate = { x: 2, y: 2 };
  const angle = 45;
  const thresholdData = NoteBeamCalculator.calculateThresholdData(
    pointOne,
    pointTwo,
    angle
  );
  const testPointTwo: Coordinate = { x: 2, y: 0 };
  const testData = NoteBeamCalculator.calculateThresholdData(
    pointOne,
    testPointTwo,
    angle
  );

  expect(testData.beamLength).toBeCloseTo(thresholdData.beamLength);
  expect(testData.y1Offset).toBe(0);
  expect(testData.y2Offset).toBeCloseTo(pointTwo.y);
});

test("Decreasing notes with threshold and offset", () => {
  const pointOne: Coordinate = { x: 0, y: 2 };
  const pointTwo: Coordinate = { x: 2, y: 0 };
  const angle = 135;
  const thresholdData = NoteBeamCalculator.calculateThresholdData(
    pointOne,
    pointTwo,
    angle
  );
  const testPointOne: Coordinate = { x: 0, y: 3 };
  const testData = NoteBeamCalculator.calculateThresholdData(
    testPointOne,
    pointTwo,
    angle
  );

  expect(testData.beamLength).toBeCloseTo(thresholdData.beamLength);
  expect(testData.y1Offset).toBeCloseTo(pointOne.y - testPointOne.y);
  expect(testData.y2Offset).toBe(0);
});

test("Increasing notes with threshold and offset (non-standard)", () => {
  const pointOne: Coordinate = { x: 99, y: 200 };
  const pointTwo: Coordinate = { x: 100, y: 576 };
  const thresholdData = NoteBeamCalculator.calculateEndpointData(
    pointOne,
    pointTwo
  );
  const testPointTwo: Coordinate = { x: pointTwo.x, y: pointTwo.y + 424 };
  const testData = NoteBeamCalculator.calculateThresholdData(
    pointOne,
    testPointTwo,
    thresholdData.beamAngle
  );
  console.log(thresholdData);
  expect(testData.beamLength).toBeCloseTo(thresholdData.beamLength);
  expect(testData.y1Offset).toBe(0);
  expect(testData.y2Offset).toBeCloseTo(pointTwo.y - testPointTwo.y);
});

test("Decreasing notes with threshold and offset (non-standard)", () => {
  const pointOne: Coordinate = { x: 23.4, y: 200 };
  const pointTwo: Coordinate = { x: 100, y: 23.4 };
  const thresholdData = NoteBeamCalculator.calculateEndpointData(
    pointOne,
    pointTwo
  );
  const testPointOne: Coordinate = { x: pointOne.x, y: pointOne.y + 72 };
  const testData = NoteBeamCalculator.calculateThresholdData(
    testPointOne,
    pointTwo,
    thresholdData.beamAngle
  );

  expect(testData.beamLength).toBeCloseTo(thresholdData.beamLength);
  expect(testData.y1Offset).toBeCloseTo(pointOne.y - testPointOne.y);
  expect(testData.y2Offset).toBe(0);
});

//#endregion
