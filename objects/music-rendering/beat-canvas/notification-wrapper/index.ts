import { MeasureNotifier } from "@/types/music-rendering";
import {
  IBeatCanvas,
  MeasureData,
  NoteData,
  RestOptions,
} from "@/types/music-rendering/canvas/beat-canvas";

export class NotificationBeatCanvas implements IBeatCanvas {
  constructor(
    private beatCanvas: IBeatCanvas,
    private onMeasureDraw: MeasureNotifier
  ) {}
  drawNote(options: NoteData) {
    this.beatCanvas.drawNote(options);
  }
  drawMeasure(options: MeasureData) {
    this.onMeasureDraw({
      topLeft: options.topLeft,
      width: options.totalWidth,
      measureIndex: options.measureIndex,
    });
    this.beatCanvas.drawMeasure(options);
  }
  drawRest(options: RestOptions) {
    this.beatCanvas.drawRest(options);
  }
}
