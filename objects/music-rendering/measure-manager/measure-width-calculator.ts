import { TimeSignature } from "@/components/providers/music/types";
import { IMeasureWidthCalculator } from "@/types/music-rendering";
import { MeasureRenderData } from "@/types/music/render-data";
import { serializeTimeSignature } from "@/utils/music";

export class MeasureWidthCalculator implements IMeasureWidthCalculator {
  width: number;
  constructor(width: number, timeSignature: TimeSignature) {
    this.width = width * (1 / this.getWidthFraction(timeSignature)); // Convert width into 4/4 width (Example: timeSignature = 2/4, width = 100. Width will equal 200: (100 * 1/.5))
  }
  private getWidthFraction(timeSignature: TimeSignature) {
    return (
      timeSignatureWidthFractions[serializeTimeSignature(timeSignature)] || 1
    );
  }

  public getMeasureWidth(
    measure: MeasureRenderData,
    timeSignature: TimeSignature
  ) {
    //TODO: Examine measure attributes and component count for additional width allowance
    return this.width * this.getWidthFraction(timeSignature);
  }
}

//Based on 4/4 size
const timeSignatureWidthFractions: { [k: string]: number } = {
  "4/4": 1,
  "2/4": 0.5,
  "1/4": 0.25,
  "3/4": 0.75,
  "6/8": 0.75,
};
