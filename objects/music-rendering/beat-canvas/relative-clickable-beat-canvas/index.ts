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

  drawNote(options: NoteData): { x: number; y: number } {
    const { displayData } = options;
    options.bodyCenter.x = this.xValueConverter(options.bodyCenter.x);
    if (displayData.beamData?.length)
      displayData.beamData.length = this.xValueConverter(
        displayData.beamData.length
      );
    return super.drawNote(options);
  }

  drawMeasure(options: MeasureOptions): void {
    options.topLeft.x = this.xValueConverter(options.topLeft.x);
    options.width = this.xValueConverter(options.width);
    super.drawMeasure(options);
  }

  drawRest(options: RestOptions): void {
    options.center.x = this.xValueConverter(options.center.x);
    super.drawRest(options);
  }
}
