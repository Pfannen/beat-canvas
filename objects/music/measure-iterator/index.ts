import {
  NoteRenderData,
  NoteType,
  TimeSignature,
} from "@/components/providers/music/types";
import { getDecimalPortion } from "../../../utils";
import { durationToRestType, isDownbeat } from "../../../utils/music";
import { attachBeamData } from "./modifiers/beam-modifier";
import Measurement from "@/objects/measurement";
import { ReadonlyMusic } from "../measure-data-container";

export class MeasureIterator {
  static iterate(music: ReadonlyMusic, measurement: Measurement) {
    const measureRenderData: NoteRenderData[][] = [];
    const measureCount = music.getMeasureCount();
    for (let i = 0; i < measureCount; i++) {
      const renderData = initializeMeasureRenderData(music, measurement, i);
      attachBeamData(music, renderData, i, measurement);
      measureRenderData.push(renderData);
    }
    return measureRenderData;
  }
}

export const initializeMeasureRenderData = (
  music: ReadonlyMusic,
  measurement: Measurement,
  measureIndex: number
) => {
  const noteCount = music.getMeasureNoteCount(measureIndex);
  const renderData: NoteRenderData[] = new Array(noteCount);
  for (let i = 0; i < noteCount; i++) {
    const note = music.getNoteData(measureIndex, i);
    renderData.push({ noteDirection: measurement.getNoteDirection(note.x) });
  }
  return renderData;
};

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
