import { getRestsForDuration } from "@/objects/music/music-display-data/music-iterator";
import {
  NoteType,
  TimeSignature,
} from "../../../components/providers/music/types";
import { Rest } from "@/types/music/render-data";

const sixEight: TimeSignature = { beatsPerMeasure: 6, beatNote: 8 };
const fourFour: TimeSignature = { beatsPerMeasure: 4, beatNote: 4 };

test("6/8: Full measure rest", () => {
  const expectedRests: Rest[] = [{ x: 0, type: "whole" }];

  const rests = getRestsForDuration(0, 6, 3, sixEight);

  expect(rests).toEqual(expectedRests); //Jest does deep equality (not just reference compare)
});

test("6/8: Up beat with segment line cross", () => {
  const expectedRests: Rest[] = [
    { x: 0.5, type: "sixteenth" },
    { x: 1, type: "quarter" },
    { x: 3, type: "eighth" },
  ];

  const rests = getRestsForDuration(0.5, 3.5, 3, sixEight);

  expect(rests).toEqual(expectedRests); //Jest does deep equality (not just reference compare)
});

test("6/8: Single note before segment line", () => {
  const expectedRests: Rest[] = [
    { x: 0.5, type: "sixteenth" },
    { x: 1, type: "quarter" },
    { x: 3, type: "dotted-quarter" },
  ];

  const rests = getRestsForDuration(0.5, 5.5, 3, sixEight);

  expect(rests).toEqual(expectedRests);
});

test("4/4: Single note before segment line", () => {
  const expectedRests: Rest[] = [
    { x: 1, type: "quarter" },
    { x: 2, type: "half" },
  ];

  const rests = getRestsForDuration(1, 3, 2, fourFour);

  expect(rests).toEqual(expectedRests);
});

test("4/4: Rests before note occurance", () => {
  const expectedRests: Rest[] = [
    { x: 0, type: "quarter" },
    { x: 1, type: "sixteenth" },
  ];

  const rests = getRestsForDuration(0, 1.25, 2, fourFour);

  expect(rests).toEqual(expectedRests);
});

test("4/4: Notes with segment line crossing", () => {
  const expectedRests: Rest[] = [
    { x: 0.25, type: "dotted-eighth" },
    { x: 1, type: "quarter" },
    { x: 2, type: "quarter" },
    { x: 3, type: "dotted-eighth" },
  ];

  const rests = getRestsForDuration(0.25, 3.5, 2, fourFour);

  expect(rests).toEqual(expectedRests);
});

test("4/4: Duration smaller than duration till downbeat", () => {
  const expectedRests: Rest[] = [{ x: 0.25, type: "sixteenth" }];

  const rests = getRestsForDuration(0.25, 0.25, 2, fourFour);

  expect(rests).toEqual(expectedRests);
});
