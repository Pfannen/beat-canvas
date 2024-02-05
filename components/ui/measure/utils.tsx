import { ReactElement } from "react";
import { NoteType, SegmentBeat } from "./types";

export type LedgerComponentRenderer = (yPos: number) => ReactElement;

export const generateMeasureComponents = (
  belowBody: number,
  aboveBody: number,
  getComponent: LedgerComponentRenderer
) => {
  const above = new Array(aboveBody);
  const body = new Array(9);
  const below = new Array(belowBody);
  const totalComponents = 9 + belowBody + aboveBody;
  for (let i = totalComponents - 1; i > -1; i--) {
    if (i < belowBody) {
      below.push(getComponent(i));
    } else if (i < belowBody + 9) {
      body.push(getComponent(i));
    } else {
      above.push(getComponent(i));
    }
  }
  return [above, body, below];
};

const noteTypeToFourFourValue: { [type in NoteType]: number } = {
  whole: 1,
  "dotted-half": 1.3333,
  half: 2,
  "dotted-quarter": 2.286,
  quarter: 4,
  "dotted-eighth": 5.333,
  eighth: 8,
  "dotted-sixteenth": 10.67,
  sixteenth: 16,
  "dotted-thirtysecond": 21.333,
  thirtysecond: 32,
};

export const getNoteTypePercentageOfBeat = (
  noteType: NoteType,
  beatNote: number
) => {
  return +(beatNote / noteTypeToFourFourValue[noteType]).toFixed(
    3
  ) as SegmentBeat; //toFixed 3 works except for dotted-thirtysecond (rounds it to .188 for 4/4 but needs to be .1875)
};
