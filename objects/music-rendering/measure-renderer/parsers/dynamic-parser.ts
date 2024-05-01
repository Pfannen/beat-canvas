import { DynamicMeasureAttributes } from "@/types/music";
import { DynamicAttributeData } from "@/types/music-rendering/canvas/beat-canvas";
import { IObjectParser } from "@/types/utils/objects-parser";

export class DynamicAttributeParser
  implements IObjectParser<DynamicMeasureAttributes, DynamicAttributeData>
{
  private attributeData: DynamicAttributeData = [];
  constructor(private newAttributes?: Partial<DynamicMeasureAttributes>) {}

  parseKey(key: keyof DynamicMeasureAttributes): void {
    this.attributeData.push({ key, value: this.newAttributes![key] });
  }
  get(): DynamicAttributeData {
    return this.attributeData;
  }
}
