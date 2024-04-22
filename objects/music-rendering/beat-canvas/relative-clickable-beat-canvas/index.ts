import { UnitConverter } from "@/types";
import { ClickableBeatCanvas } from "../clickable-beat-canvas";
import {
  MeasureOptions,
  NoteData,
  RestOptions,
} from "@/types/music-rendering/canvas/beat-canvas";

export class RelativeClickableBeatCanvas extends ClickableBeatCanvas {
  // private xValueConverter: UnitConverter<number, number>;

  constructor(
    private xValueConverter: UnitConverter<number, number>,
    ...args: ConstructorParameters<typeof ClickableBeatCanvas>
  ) {
    super(...args);
  }

  // protected drawNoteBody(options: NoteData): void {
  //     this.canvas.drawEllipse({
  //         center: options.bodyCenter,
  //         aspectRatio: this.drawOptions.note.noteBodyAspectRatio,
  //         diameter: options.bodyHeight,
  //         drawOptions: { degreeRotation: this.drawOptions.note.noteBodyAngle },
  //       });
  //   }

  drawNote(options: NoteData): { x: number; y: number } {
    options.bodyCenter.x = this.xValueConverter(options.bodyCenter.x);
    if (options.beamData?.length)
      options.beamData.length = this.xValueConverter(options.beamData.length);
    return super.drawNote(options);
  }

  drawMeasure(options: MeasureOptions): void {
    options.topLeft.x = this.xValueConverter(options.topLeft.x);
    options.width = this.xValueConverter(options.width);
    super.drawMeasure(options);
  }

  drawRest(options: RestOptions): void {
    const { path, noteBodyFraction } = this.getRestData(options.type);
    options.center.x = this.xValueConverter(options.center.x);
    this.canvas.drawSVG({
      path,
      center: options.center,
      height: options.noteBodyHeight * noteBodyFraction,
      width: this.xValueConverter(options.noteBodyHeight * noteBodyFraction),
    });
  }
}
