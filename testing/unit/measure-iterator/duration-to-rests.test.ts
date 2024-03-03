import {
  Measure,
  NoteType,
  TimeSignature,
} from "../../../components/providers/music/types";
import { getRestsForDuration } from "../../../objects/music/measure-iterator";

const sixEight: TimeSignature = { beatsPerMeasure: 6, beatNote: 8 };
const fourFour: TimeSignature = { beatsPerMeasure: 4, beatNote: 4 };

test("6/8: Full measure rest", () => {
  const expectedRests: NoteType[] = ["whole"];

  const rests = getRestsForDuration(0, 6, 3, sixEight);

  expect(rests).toEqual(expectedRests); //Jest does deep equality (not just reference compare)
});

test("6/8: Up beat with segment line cross", () => {
  const expectedRests: NoteType[] = ["sixteenth", "quarter", "eighth"];

  const rests = getRestsForDuration(0.5, 3.5, 3, sixEight);

  expect(rests).toEqual(expectedRests); //Jest does deep equality (not just reference compare)
});

test("6/8: Single note before segment line", () => {
  const expectedRests: NoteType[] = ["sixteenth", "quarter", "dotted-quarter"];

  const rests = getRestsForDuration(0.5, 5.5, 3, sixEight);

  expect(rests).toEqual(expectedRests);
});

test("4/4: Single note before segment line", () => {
  const expectedRests: NoteType[] = ["quarter", "half"];

  const rests = getRestsForDuration(1, 3, 2, fourFour);

  expect(rests).toEqual(expectedRests);
});

test("4/4: Rests before note occurance", () => {
  const expectedRests: NoteType[] = ["quarter", "sixteenth"];

  const rests = getRestsForDuration(0, 1.25, 2, fourFour);

  expect(rests).toEqual(expectedRests);
});

test("4/4: Notes with segment line crossing", () => {
  const expectedRests: NoteType[] = [
    "dotted-eighth",
    "quarter",
    "quarter",
    "dotted-eighth",
  ];

  const rests = getRestsForDuration(0.25, 3.5, 2, fourFour);

  expect(rests).toEqual(expectedRests);
});

test("4/4: Duration smaller than duration till downbeat", () => {
  const expectedRests: NoteType[] = ["sixteenth"];

  const rests = getRestsForDuration(0.25, 0.25, 2, fourFour);

  expect(rests).toEqual(expectedRests);
});
