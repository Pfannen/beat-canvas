import { Measure, Note } from "@/components/providers/music/types";
import MeasureNote from "../measure-item/measure-note";
import { getNoteDuration } from "@/components/providers/music/utils";
import { durationToNoteType } from "@/utils/music";
import MeasureRest from "../measure-item/measure-rest";
import { fractionToPercent } from "@/utils";
import { ReactNode } from "react";
import Measurement from "@/objects/measurement";
import { NoteAttributeComponent } from "@/lib/notes/types";
import { getNoteBeam } from "@/lib/notes/ui/note-attributes";

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
  const notes = measure.notes;
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const noteDuration = getNoteDuration(note.type, 4, note.annotations?.dotted);
    const restLength = note.x - currX;
    if (restLength) {
      components.push(getDisplayRest(restLength, currX, 4, measurements));
    }
    components.push(getDisplayNote(note, measurements));
    currX = note.x + noteDuration;
  }
  const restLength = 4 - currX;
  if (restLength) {
    components.push(getDisplayRest(restLength, currX, 4, measurements));
  }
  return components;
};

// const getItemsForMeasure = (measure: Measure, measurements: Measurement) => {
//   const components: ReactNode[] = [];
//   let currX = 0;
//   const notes = measure.notes;
//   for (let i = 0; i < notes.length; i++) {
//     const note = notes[i];
//     let beamData;
//     if (i !== notes.length - 1) {
//       const nextNote = notes[i + 1];
//       beamData = measurements.getNoteBeamData([note, nextNote], "up");
//     }

//     const noteDuration = getNoteDuration(note.type, 4);
//     const restLength = note.x - currX;
//     if (restLength) {
//       components.push(getDisplayRest(restLength, currX, 4, measurements));
//     }
//     components.push(
//       getDisplayNote(
//         note,
//         measurements,
//         beamData && [
//           getNoteBeam({
//             lengthInBodyUnits: beamData.beamLength,
//             widthFraction: 1,
//             angleDeg: beamData.beamAngle,
//           }),
//         ]
//       )
//     );
//     currX = note.x + noteDuration;
//   }
//   const restLength = 4 - currX;
//   if (restLength) {
//     components.push(getDisplayRest(restLength, currX, 4, measurements));
//   }
//   return components;
// };

const getDisplayNote = (
  note: Note,
  measurements: Measurement,
  extraAttributes?: NoteAttributeComponent<any>[]
) => {
  const length = getNoteDuration(note.type, 4, note.annotations?.dotted);
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
      direction={note.y > 5 ? "down" : "up"}
      extraAttributes={extraAttributes}
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
    y: measurements.getMiddleYPos(),
    length: duration,
  });
  const component = (
    <MeasureRest
      type={type}
      containerProps={{
        bottom: fractionToPercent(y),
        left: fractionToPercent(x),
        height: fractionToPercent(measurements.getSpaceFraction() * 2.5),
      }}
    />
  );
  return component;
};
