import { NoteBeamCalculator } from "../../../objects/measurement/note-beam-calculator";
import { Coordinate } from "../../../objects/measurement/types";

//#region notesAreOrdered
test("notesAreOrdered - Increasing notes", () => {
  const points: Coordinate[] = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
    { x: 0, y: 4 },
  ];
  const res = NoteBeamCalculator.notesAreOrdered(points);
  expect(res).toBeTruthy();
});

test("notesAreOrdered - Decreasing notes", () => {
  const points: Coordinate[] = [
    { x: 0, y: 4 },
    { x: 0, y: 3 },
    { x: 0, y: 2 },
    { x: 0, y: 1 },
    { x: 0, y: 0 },
  ];
  const res = NoteBeamCalculator.notesAreOrdered(points);
  expect(res).toBeTruthy();
});

test("notesAreOrdered - Decreasing notes except last", () => {
  const points: Coordinate[] = [
    { x: 0, y: 4 },
    { x: 0, y: 3 },
    { x: 0, y: 2 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
  ];
  const res = NoteBeamCalculator.notesAreOrdered(points);
  expect(!res).toBeTruthy();
});

test("notesAreOrdered - Non-ordered notes", () => {
  const points: Coordinate[] = [
    { x: 0, y: 4 },
    { x: 0, y: 3 },
    { x: 0, y: 4 },
    { x: 0, y: 3 },
    { x: 0, y: 4 },
  ];
  const res = NoteBeamCalculator.notesAreOrdered(points);
  expect(!res).toBeTruthy();
});

test("notesAreOrdered - Non-ordered notes (all equal)", () => {
  const points: Coordinate[] = [
    { x: 0, y: 4 },
    { x: 0, y: 4 },
    { x: 0, y: 4 },
    { x: 0, y: 4 },
    { x: 0, y: 4 },
  ];
  const res = NoteBeamCalculator.notesAreOrdered(points);
  expect(!res).toBeTruthy();
});
//#endregion

//#region Beam Position Data with Non-ordered notes
test("Beam Data - All equal notes (direction = up)", () => {
  const points: Coordinate[] = [
    { x: 0, y: 5 },
    { x: 1, y: 5 },
    { x: 2, y: 5 },
  ];
  const expectedLength = 2;
  const expectedAngle = 90;
  const beamData = NoteBeamCalculator.getPositionData(points, "up", 90);
  expect(beamData.beamLength).toBe(expectedLength);
  expect(beamData.beamAngle).toBe(expectedAngle);
  beamData.noteOffsets.forEach((offset) => expect(offset).toBe(0));
});

test("Beam Data - All equal notes (direction = down)", () => {
  const points: Coordinate[] = [
    { x: 0, y: 5 },
    { x: 1, y: 5 },
    { x: 2, y: 5 },
  ];
  const expectedLength = 2;
  const expectedAngle = 90;
  const beamData = NoteBeamCalculator.getPositionData(points, "down", 90);
  expect(beamData.beamLength).toBe(expectedLength);
  expect(beamData.beamAngle).toBe(expectedAngle);
  beamData.noteOffsets.forEach((offset) => expect(offset).toBe(0));
});

test("Beam Data - Decrease then increase (direction = up)", () => {
  const points: Coordinate[] = [
    { x: 0, y: 6 },
    { x: 1, y: 5 },
    { x: 2, y: 6 },
  ];
  const maximum = 6;
  const expectedLength = 2;
  const expectedAngle = 90;
  const beamData = NoteBeamCalculator.getPositionData(points, "up", 90);
  expect(beamData.beamLength).toBe(expectedLength);
  expect(beamData.beamAngle).toBe(expectedAngle);
  beamData.noteOffsets.forEach((offset, i) =>
    expect(offset).toBe(maximum - points[i].y)
  );
});

test("Beam Data - Decrease then increase (direction = down)", () => {
  const points: Coordinate[] = [
    { x: 0, y: 6 },
    { x: 1, y: 5 },
    { x: 2, y: 6 },
  ];
  const minimum = 5;
  const expectedLength = 2;
  const expectedAngle = 90;
  const beamData = NoteBeamCalculator.getPositionData(points, "down", 90);
  expect(beamData.beamLength).toBe(expectedLength);
  expect(beamData.beamAngle).toBe(expectedAngle);
  beamData.noteOffsets.forEach((offset, i) =>
    expect(offset).toBe(points[i].y - minimum)
  );
});

test("Beam Data - Increase then decrease (direction = up)", () => {
  const points: Coordinate[] = [
    { x: 0, y: 5 },
    { x: 1, y: 6 },
    { x: 2, y: 5 },
  ];
  const maximum = 6;
  const expectedLength = 2;
  const expectedAngle = 90;
  const beamData = NoteBeamCalculator.getPositionData(points, "up", 90);
  expect(beamData.beamLength).toBe(expectedLength);
  expect(beamData.beamAngle).toBe(expectedAngle);
  beamData.noteOffsets.forEach((offset, i) =>
    expect(offset).toBe(maximum - points[i].y)
  );
});

test("Beam Data - Increase then decrease (direction = down)", () => {
  const points: Coordinate[] = [
    { x: 0, y: 5 },
    { x: 1, y: 6 },
    { x: 2, y: 5 },
  ];
  const minimum = 5;
  const expectedLength = 2;
  const expectedAngle = 90;
  const beamData = NoteBeamCalculator.getPositionData(points, "down", 90);
  expect(beamData.beamLength).toBe(expectedLength);
  expect(beamData.beamAngle).toBe(expectedAngle);
  beamData.noteOffsets.forEach((offset, i) =>
    expect(offset).toBe(points[i].y - minimum)
  );
});

test("Beam Data - Decrease then equal (direction = up)", () => {
  const points: Coordinate[] = [
    { x: 0, y: 5 },
    { x: 1, y: 4 },
    { x: 2, y: 4 },
  ];
  const maximum = 5;
  const expectedLength = 2;
  const expectedAngle = 90;
  const beamData = NoteBeamCalculator.getPositionData(points, "up", 90);
  expect(beamData.beamLength).toBe(expectedLength);
  expect(beamData.beamAngle).toBe(expectedAngle);
  beamData.noteOffsets.forEach((offset, i) =>
    expect(offset).toBe(maximum - points[i].y)
  );
});
//#endregion
