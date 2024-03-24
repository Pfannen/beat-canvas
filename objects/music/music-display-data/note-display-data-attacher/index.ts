import { NoteDisplayData } from "@/components/providers/music/types";
import { ReadonlyMusic } from "../../measure-data-container";
import { DisplayDataAttacher } from "../attachments/types";

export class NoteDisplayDataAttcher {
  static attach(
    music: ReadonlyMusic,
    noteDisplayData: NoteDisplayData[],
    attachments: DisplayDataAttacher[]
  ) {
    const measureCount = music.getMeasureCount();
    for (let i = 0; i < measureCount; i++) {
      attachments.forEach((del) => {
        del({ music, measureIndex: i, noteDisplayData });
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
