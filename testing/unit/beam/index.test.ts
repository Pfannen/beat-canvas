import { NoteBeamCalculator } from "../../../objects/measurement/note-beam-calculator";
import { Coordinate } from "../../../objects/measurement/types";

const expectedHypotenuse = (sideOne: number, sideTwo: number) =>
  Math.sqrt(Math.pow(sideOne, 2) + Math.pow(sideTwo, 2));

//#region beam angles and lengths
test("Increasing notes", () => {
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

//#region beam threshold
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
