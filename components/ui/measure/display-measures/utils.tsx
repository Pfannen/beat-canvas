import { Measure, Note } from "@/components/providers/music/types";
import MeasureNote from "../measure-item/measure-note";
import Measurement from "@/objects/music/measurement";
import { getNoteDuration } from "@/components/providers/music/utils";
import { durationToNoteType } from "@/utils/music";
import MeasureRest from "../measure-item/measure-rest";
import { fractionToPercent } from "@/utils";
import { ReactNode } from "react";

export const getMeasureItems = (
  measures: Measure[],
  measurements: Measurement
) => {
  return measures.map((measure) => {
    return getItemsForMeasure(measure, measurements);
  });
};

const getItemsForMeasure = (measure: Measure, measurements: Measurement) => {
  const components: ReactNode[] = [];
  let currX = 0;
  measure.notes.forEach((note) => {
    const noteDuration = getNoteDuration(note.type, 4);
    const restLength = note.x - currX;
    if (restLength) {
      components.push(getDisplayRest(restLength, currX, 4, measurements));
    }
    components.push(getDisplayNote(note, measurements));
    currX = note.x + noteDuration;
  });
  const restLength = 4 - currX;
  if (restLength) {
    components.push(getDisplayRest(restLength, currX, 4, measurements));
  }
  return components;
};

const getDisplayNote = (note: Note, measurements: Measurement) => {
  const length = getNoteDuration(note.type, 4);
  const { x, y } = measurements.getNoteOffset({ ...note, length });
  const component = (
    <MeasureNote
      containerProps={{
        bottom: fractionToPercent(y),
        left: fractionToPercent(x),
        height: fractionToPercent(measurements.getSpaceFraction()),
      }}
      type={note.type}
      key={`${x}-${y}`}
    />
  );
  return component;
};

const getDisplayRest = (
  duration: number,
  xPos: number,
  beatNote: number,
  measurements: Measurement
) => {
  const type = durationToNoteType(duration, beatNote);
  const { x, y } = measurements.getNoteOffset({
    x: xPos,
    y: 8, //Replace this with the y value that is the middle of the measure
    length: duration,
  });
  const component = (
    <MeasureRest
      type={type}
      containerProps={{
        bottom: fractionToPercent(y),
        left: fractionToPercent(x),
        height: fractionToPercent(measurements.getSpaceFraction() * 3),
      }}
    />
  );
  return component;
};
