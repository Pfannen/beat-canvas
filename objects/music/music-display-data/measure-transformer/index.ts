import {
  Attacher,
  AttacherArgs,
  getAttacher,
} from "../note-display-data-attacher/attachments";
import { NoteDisplayDataAttcher } from "../note-display-data-attacher";
import { Music } from "../../readonly-music";
import { DisplayDataAttacher } from "../note-display-data-attacher/attachments/types";
import { MusicIterator, MusicIteratorCallback } from "../music-iterator";
import { MeasureRenderData } from "@/types/music/render-data";
import { NoteDisplayData } from "@/types/music/draw-data";

type AttacherData<T extends Attacher> = {
  attacher: T;
  context: AttacherArgs<T>;
};

export class MeasureTransformer {
  private music: Music;
  private noteDisplayData?: NoteDisplayData[][];
  private measureRenderData?: MeasureRenderData[];

  constructor(music: Music) {
    this.music = music;
  }

  private createMeasureRenderData() {
    this.measureRenderData = [];
    const cb: MusicIteratorCallback = (measure) =>
      this.measureRenderData!.push(measure);

    this.iterateMeasureDisplayData(cb);
  }

  //TODO: Take optional indicies
  public computeDisplayData<T extends Attacher>(attachers?: AttacherData<T>[]) {
    if (!this.noteDisplayData) {
      this.noteDisplayData = NoteDisplayDataAttcher.initialize(this.music);
    }
    const attacherDels = attachers?.map(({ attacher, context }) => {
      let del = getAttacher(attacher) as any;
      if (context) {
        del = del(context);
      }
      return del as DisplayDataAttacher;
    });

    if (attacherDels) {
      NoteDisplayDataAttcher.attach(
        this.music,
        this.noteDisplayData!,
        attacherDels
      );
    }
    this.createMeasureRenderData();
  }

  public getMeasureRenderData() {
    if (!this.measureRenderData) {
      this.computeDisplayData();
    }
    return this.measureRenderData!;
  }

  public iterateMeasureDisplayData(cb: MusicIteratorCallback) {
    if (!this.noteDisplayData) {
      throw new Error("MeasureTransformer: Display data has not been computed");
    }
    MusicIterator.iterate(
      this.music.getMeasures(),
      this.noteDisplayData,
      this.music,
      cb
    );
  }
}
