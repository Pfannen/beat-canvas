import { NoteDisplayData } from "@/types/music-rendering/draw-data/note";
import { ReadonlyMusic } from "../../readonly-music";
import { DisplayDataAttacher } from "./attachments/types";

export class NoteDisplayDataAttcher {
  static attach(
    music: ReadonlyMusic,
    noteDisplayMeasures: NoteDisplayData[][],
    attachments: DisplayDataAttacher[]
  ) {
    const measureCount = music.getMeasureCount();
    for (let i = 0; i < measureCount; i++) {
      attachments.forEach((del) => {
        del({
          music,
          measureIndex: i,
          noteDisplayData: noteDisplayMeasures[i],
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
