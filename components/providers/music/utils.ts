import { NoteType, SegmentBeat } from "./types";

const noteTypeToFourFourValue: { [type in NoteType]: number } = {
  whole: 1,
  "dotted-half": 1.3333,
  half: 2,
  "dotted-quarter": 2.667,
  quarter: 4,
  "dotted-eighth": 5.333,
  eighth: 8,
  "dotted-sixteenth": 10.67,
  sixteenth: 16,
  "dotted-thirtysecond": 21.333,
  thirtysecond: 32,
};

export const getNoteDuration = (noteType: NoteType, beatNote: number) => {
  return +(beatNote / noteTypeToFourFourValue[noteType]).toFixed(
    3
  ) as SegmentBeat; //toFixed 3 works except for dotted-thirtysecond (rounds it to .188 for 4/4 but needs to be .1875)
};
