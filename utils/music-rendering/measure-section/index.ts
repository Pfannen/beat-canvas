import {
  MeasureSection,
  MeasureSectionMetadata,
  Repeat,
  StaticMeasureAttribute,
  StaticMeasureAttributes,
} from "@/types/music";
import {
  InitialMeasureSection,
  MeasureSectionInfo,
} from "@/types/music-rendering/canvas/beat-canvas/drawers/measure/measure-section";

const measureSectionOrder: Record<MeasureSection, number> = {
  clef: 0,
  keySignature: 1,
  timeSignature: 2,
  forwardRepeat: 3,
  note: 4,
  repeatEndings: 5,
  backwardRepeat: 6,
};

export const getMeasureSectionOrder = (section: MeasureSection) => {
  return measureSectionOrder[section];
};

type MeasureSectionDataGetter<T extends StaticMeasureAttribute> = <
  U extends MeasureSection
>(
  section: StaticMeasureAttributes[T]
) => MeasureSectionInfo<U>;

const getRepeatSectionData: MeasureSectionDataGetter<"repeat"> = (repeat) => {
  if (repeat!.forward) {
    return { key: "forwardRepeat", value: undefined };
  }
  return { key: "backwardRepeat", value: repeat!.repeatCount } as any;
};

const measureSectionDataMap: Partial<
  Record<StaticMeasureAttribute, MeasureSectionDataGetter<any>>
> = {
  repeat: getRepeatSectionData,
};

// This is only needed because of the repeat section. Since the repeat attribute is either forward or backward, we have to know which one it is and make it into a definitive section
export const getMeasureSectionData = <T extends StaticMeasureAttribute>(
  attribute: T,
  data: StaticMeasureAttributes[T]
): MeasureSectionInfo<any> => {
  const getter = measureSectionDataMap[attribute];
  if (getter) {
    return getter(data);
  }
  return { key: attribute, data };
};
