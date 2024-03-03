import {
  Measure,
  NoteType,
  TimeSignature,
} from "@/components/providers/music/types";
import { getDecimalPortion } from "../../../utils";
import { durationToRestType, isDownbeat } from "../../../utils/music";

export class MeasureIterator {
  static iterate(measures: Measure[]) {}
}

//Temporary export for testing
export const getRestsForDuration = (
  x: number,
  duration: number,
  subdivisionLength: number,
  timeSignature: TimeSignature
) => {
  if (timeSignature.beatsPerMeasure === duration) {
    return ["whole"];
  }
  const rests: NoteType[] = [];
  if (!isDownbeat(x)) {
    const partialDuration = 1 - getDecimalPortion(x);
    const dur = Math.min(duration, partialDuration);
    rests.push(durationToRestType(dur, timeSignature));
    x += dur;
    duration -= dur;
  }

  const fractionalDuaration = getDecimalPortion(duration);
  duration -= fractionalDuaration;

  while (duration) {
    const dur = getMaxRestDuration(x, duration, subdivisionLength);
    rests.push(durationToRestType(dur, timeSignature));
    duration -= dur;
    x += dur;
  }

  if (fractionalDuaration) {
    rests.push(durationToRestType(fractionalDuaration, timeSignature));
  }

  return rests;
};

const getMaxRestDuration = (
  x: number,
  duration: number,
  subdivisionLength: number
) => {
  const distanceToSubdivision = subdivisionLength - (x % subdivisionLength);
  return Math.min(duration, distanceToSubdivision);
};
