import { BlockDirection } from "@/types/music-rendering/pdf";
import { Drawer } from "..";
import {
  DynamicMeasureAttribute,
  DynamicMeasureAttributes,
} from "@/types/music";

export type DynamicAttributeArgs = {
  measureYValues: BlockDirection<number>;
  bodyHeight: number;
  noteStartX: number;
};

export type DynamicAttributeDrawer = Drawer<DynamicAttributeArgs>;

export type DynamicAttributeDel<T extends DynamicMeasureAttribute> = (
  data: DynamicMeasureAttributes[T]
) => DynamicAttributeDrawer;

export type DynamicAttributeDelegates = {
  [K in DynamicMeasureAttribute]: DynamicAttributeDel<K>;
};
