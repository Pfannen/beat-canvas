import {
  MeasureSectionMetadata,
  StaticMeasureAttribute,
  StaticMeasureAttributes,
} from "@/types/music";
import { MeasureSectionData } from "@/types/music-rendering/attribute-parsing";
import { InitialMeasureSectionArray } from "@/types/music-rendering/canvas/beat-canvas/drawers/measure/measure-section";
import { IObjectsParser } from "@/types/utils/objects-parser";
import { isStaticMeasureAttribute } from "@/utils/music";
import { getMeasureSectionData } from "@/utils/music-rendering/measure-section";

export class StaticAttributeParser
  implements IObjectsParser<StaticMeasureAttributes, MeasureSectionData>
{
  private attributes = {} as MeasureSectionMetadata;
  private sections: InitialMeasureSectionArray = [];

  constructor(
    private currentAttributes: StaticMeasureAttributes,
    private newAttributes: Partial<StaticMeasureAttributes> = {}
  ) {
    this.initializeAttributes();
  }

  private initializeAttributes() {
    for (const attribute in this.currentAttributes) {
      if (
        isStaticMeasureAttribute(attribute) &&
        !this.newAttributes[attribute as StaticMeasureAttribute]
      ) {
        const data =
          this.currentAttributes[attribute as StaticMeasureAttribute];
        const section = getMeasureSectionData(
          attribute as StaticMeasureAttribute,
          data
        );
        this.sections.push({
          key: section.key,
          displayByDefault: false,
          data: section.data,
        });
        this.attributes[section.key as never] = section.data as never;
      }
    }
  }

  parse(attribute: keyof StaticMeasureAttributes): void {
    const data = this.newAttributes[attribute];
    const section = getMeasureSectionData(attribute, data);
    this.sections.push({
      key: section.key,
      displayByDefault: true,
      data: section.data,
    });
    this.attributes[section.key as never] = section.data as never;
  }

  get(): MeasureSectionData {
    return { sections: this.sections, attributes: this.attributes };
  }
}
