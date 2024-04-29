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
import { NoteDisplayData } from "@/types/music-rendering/draw-data/note";
import { Measurements } from "@/objects/measurement/measurements";

type AttacherData<T extends Attacher> = {
  attacher: T;
  context: AttacherArgs<T>;
};

export class MeasureTransformer {
  private music: Music;
  private measurements: Measurements;
  private noteDisplayData?: NoteDisplayData[][];
  private measureRenderData?: MeasureRenderData[];

  constructor(music: Music, measurements: Measurements) {
    this.music = music;
    this.measurements = measurements;
  }

  private createMeasureRenderData() {
    this.measureRenderData = [];
    const cb: MusicIteratorCallback = (measure) =>
      this.measureRenderData!.push(measure);

    this.iterateMeasureDisplayData(cb);
  }

  public computeDisplayData<T extends Attacher>(attachers?: AttacherData<T>[]) {
    if (!this.noteDisplayData) {
      this.noteDisplayData = NoteDisplayDataAttcher.initialize(this.music);
    }
    const attacherDels = attachers?.map(({ attacher, context }) => {
      let del = getAttacher(attacher) as any;
      del = context ? del(context) : del();
      return del as DisplayDataAttacher;
    });

    if (attacherDels) {
      NoteDisplayDataAttcher.attach(
        this.music,
        this.noteDisplayData!,
        this.measurements,
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
