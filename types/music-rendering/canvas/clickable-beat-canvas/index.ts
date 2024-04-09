import { UnitConverter } from "@/types";
import { Coordinate } from "@/objects/measurement/types";
import { ComponentProps } from "@/types/polymorphic";

export type PropDelegate<T> = (data: T) => ComponentProps<"div">;

export type NoteIdentifier = { measureIndex: number; noteIndex: number };

export type NotePropDel = PropDelegate<NoteIdentifier>;

export type MeasureIdentifier = { measureIndex: number };

export type MeasurePropDel = PropDelegate<MeasureIdentifier>;

export type MeasureComponentIdentifier = {
  measureIndex: number;
  absoluteYPos: number;
  isLine: boolean;
  isBody: boolean;
};

export type MeasureCompPropDel = PropDelegate<MeasureComponentIdentifier>;

export type AbsolutePositionConverter = UnitConverter<number, number>;

export type ClickableOverlayContext = {
  topLeft: Coordinate;
  width: number;
  height: number;
};

export type PropDelegates = {
  getMeasureProps: MeasurePropDel;
  getNoteProps: NotePropDel;
  getMeasureComponentProps: MeasureCompPropDel;
};

export type BeatCanvasPropDelegates = Partial<PropDelegates>;
