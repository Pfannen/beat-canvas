import { NoteRenderData } from "@/components/providers/music/types";
import { attachBeamData } from "./modifiers/beam-modifier";
import Measurement from "@/objects/measurement";
import { ReadonlyMusic } from "../measure-data-container";

export class MusicDisplayData {
  static attach(music: ReadonlyMusic, measurement: Measurement) {
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
    renderData[i] = { noteDirection: measurement.getNoteDirection(note.y) };
  }
  return renderData;
};
