import { NoteDisplayData } from "@/types/music-rendering/draw-data/note";
import { ReadonlyMusic } from "../../readonly-music";
import { DisplayDataAttacher } from "./attachments/types";
import { Measurements } from "@/objects/measurement/measurements";

export class NoteDisplayDataAttcher {
  static attach(
    music: ReadonlyMusic,
    noteDisplayMeasures: NoteDisplayData[][],
    measurements: Measurements,
    attachments: DisplayDataAttacher[]
  ) {
    const measureCount = music.getMeasureCount();
    for (let i = 0; i < measureCount; i++) {
      attachments.forEach((del) => {
        del({
          music,
          measureIndex: i,
          noteDisplayData: noteDisplayMeasures[i],
          measurements,
        });
      });
    }
  }

  private static initializeMeasureRenderData(
    music: ReadonlyMusic,
    measureIndex: number
  ) {
    const noteCount = music.getMeasureNoteCount(measureIndex);
    const renderData: NoteDisplayData[] = new Array(noteCount);
    for (let i = 0; i < noteCount; i++) {
      renderData[i] = {
        noteDirection: music.getNoteDirection(measureIndex, i),
        stemOffset: 0,
      };
    }
    return renderData;
  }

  static initialize(music: ReadonlyMusic) {
    const noteDisplayData: NoteDisplayData[][] = [];
    const measureCount = music.getMeasureCount();
    for (let i = 0; i < measureCount; i++) {
      const renderData = this.initializeMeasureRenderData(music, i);
      noteDisplayData.push(renderData);
    }
    return noteDisplayData;
  }
}
