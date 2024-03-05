import { NoteBeamCalculator } from "../../../objects/measurement/note-beam-calculator";
import { Coordinate } from "../../../objects/measurement/types";

const expectedHypotenuse = (sideOne: number, sideTwo: number) =>
  Math.sqrt(Math.pow(sideOne, 2) + Math.pow(sideTwo, 2));

//Calculator tests verified using: https://www.omnicalculator.com/math/right-triangle-side-angle

//#region Beam Angles and Lengths
test("EndpointData - Increasing notes - simple", () => {
  const pointOne: Coordinate = { x: 0, y: 0 };
  const pointTwo: Coordinate = { x: 2, y: 2 };
  const data = NoteBeamCalculator.calculateEndpointData(pointOne, pointTwo);
  expect(data.beamAngle).toBe(45);
  expect(data.beamLength).toBe(expectedHypotenuse(2, 2));
});

test("EndpointData - Increasing notes - calculator", () => {
  const pointOne: Coordinate = { x: 0, y: 0 };
  const pointTwo: Coordinate = { x: 397, y: 1088 };
  const data = NoteBeamCalculator.calculateEndpointData(pointOne, pointTwo);
  expect(data.beamAngle).toBeCloseTo(90 - 69.95);
  expect(data.beamLength).toBeCloseTo(1158.2, 1);
});

test("EndpointData - Decreasing notes - simple", () => {
  const pointOne: Coordinate = { x: 0, y: 2 };
  const pointTwo: Coordinate = { x: 2, y: 0 };
  const data = NoteBeamCalculator.calculateEndpointData(pointOne, pointTwo);
  expect(data.beamAngle).toBe(135);
  expect(data.beamLength).toBe(expectedHypotenuse(2, 2));
});

test("EndpointData - Decreasing notes - calculator", () => {
  const pointOne: Coordinate = { x: 0, y: 271 };
  const pointTwo: Coordinate = { x: 19, y: 0 };
  const data = NoteBeamCalculator.calculateEndpointData(pointOne, pointTwo);
  expect(data.beamAngle).toBeCloseTo(180 - 4.0105);
  expect(data.beamLength).toBeCloseTo(271.67);
});

test("EndpointData - Equal y notes", () => {
  const pointOne: Coordinate = { x: 0, y: 2 };
  const pointTwo: Coordinate = { x: 2, y: 2 };
  const data = NoteBeamCalculator.calculateEndpointData(pointOne, pointTwo);
  expect(data.beamAngle).toBe(90);
  expect(data.beamLength).toBe(2);
});
//#endregion

//#region Beam Treshold Simple Cases
test("ThresholdData - Increasing notes with threshold", () => {
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

test("ThresholdData - Decreasing notes with threshold", () => {
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

test("ThresholdData - Equal notes with threshold", () => {
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
test("ThresholdData - Increasing notes with threshold and offset", () => {
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
  expect(testData.y1Offset).toBeCloseTo(0);
  expect(testData.y2Offset).toBeCloseTo(pointTwo.y);
});

test("ThresholdData - Decreasing notes with threshold and offset", () => {
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
  expect(testData.y2Offset).toBeCloseTo(0);
});

test("ThresholdData - Increasing notes with threshold and offset (non-standard)", () => {
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
  expect(testData.beamLength).toBeCloseTo(thresholdData.beamLength);
  expect(testData.y1Offset).toBeCloseTo(0);
  expect(testData.y2Offset).toBeCloseTo(pointTwo.y - testPointTwo.y);
});

test("ThresholdData - Decreasing notes with threshold and offset (non-standard)", () => {
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
  expect(testData.y2Offset).toBeCloseTo(0);
});

//#endregion

//#region Beam Position Data with Notes
test("BeamPosition - Two increasing notes (no threshold)", () => {
  const pointOne: Coordinate = { x: 0, y: 0 };
  const pointTwo: Coordinate = { x: 2, y: 2 };
  const data = NoteBeamCalculator.getPositionData(
    [pointOne, pointTwo],
    "up",
    45
  );
  expect(data.beamAngle).toBe(45);
  expect(data.beamLength).toBe(expectedHypotenuse(2, 2));
  data.noteOffsets.forEach((offset) => {
    expect(offset).toBeCloseTo(0);
  });
});

test("BeamPosition - Two increasing notes w/ threshold (direction up)", () => {
  const pointOne: Coordinate = { x: 0, y: 0 };
  const pointTwo: Coordinate = { x: 2, y: 3 };

  const data = NoteBeamCalculator.getPositionData(
    [pointOne, pointTwo],
    "up",
    45
  );
  expect(data.beamAngle).toBe(45);
  expect(data.beamLength).toBeCloseTo(expectedHypotenuse(2, 2));
  expect(data.noteOffsets[0]).toBeCloseTo(1);
  expect(data.noteOffsets[1]).toBeCloseTo(0);
});

test("BeamPosition - Two increasing notes w/ threshold (direction down)", () => {
  const pointOne: Coordinate = { x: 0, y: 0 };
  const pointTwo: Coordinate = { x: 2, y: 3 };

  const data = NoteBeamCalculator.getPositionData(
    [pointOne, pointTwo],
    "down",
    45
  );
  expect(data.beamAngle).toBe(45);
  expect(data.beamLength).toBeCloseTo(expectedHypotenuse(2, 2));
  expect(data.noteOffsets[0]).toBeCloseTo(0);
  expect(data.noteOffsets[1]).toBeCloseTo(-1);
});

test("BeamPosition - Two decreasing notes (no threshold)", () => {
  const pointOne: Coordinate = { x: 2, y: 2 };
  const pointTwo: Coordinate = { x: 0, y: 0 };
  const data = NoteBeamCalculator.getPositionData(
    [pointOne, pointTwo],
    "up",
    45
  );
  expect(data.beamAngle).toBe(135);
  expect(data.beamLength).toBe(expectedHypotenuse(2, 2));
  data.noteOffsets.forEach((offset) => {
    expect(offset).toBeCloseTo(0);
  });
});

test("BeamPosition - Two decreasing notes w/ threshold (direction up)", () => {
  const pointOne: Coordinate = { x: 2, y: 3 };
  const pointTwo: Coordinate = { x: 0, y: 0 };

  const data = NoteBeamCalculator.getPositionData(
    [pointOne, pointTwo],
    "up",
    45
  );
  expect(data.beamAngle).toBe(90 + 45);
  expect(data.beamLength).toBeCloseTo(2.8284);
  expect(data.noteOffsets[0]).toBeCloseTo(0);
  expect(data.noteOffsets[1]).toBeCloseTo(1);
});

test("BeamPosition - Two decreasing notes w/ threshold (direction down)", () => {
  const pointOne: Coordinate = { x: 2, y: 3 };
  const pointTwo: Coordinate = { x: 0, y: 0 };

  const data = NoteBeamCalculator.getPositionData(
    [pointOne, pointTwo],
    "down",
    45
  );
  expect(data.beamAngle).toBe(90 + 45);
  expect(data.beamLength).toBeCloseTo(2.8284);
  expect(data.noteOffsets[0]).toBeCloseTo(-1);
  expect(data.noteOffsets[1]).toBeCloseTo(0);
});
//#endregion
