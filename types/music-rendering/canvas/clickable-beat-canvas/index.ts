import { UnitConverter } from "@/types";
import { Coordinate } from "@/objects/measurement/types";
import { ComponentProps } from "react";

export type ClickDelegate<T> = (index: T) => void;

export type NoteClickArgs = { measureIndex: number; noteIndex: number };

export type NoteClickDel = ClickDelegate<NoteClickArgs>;

export type MeasureClickArgs = { measureIndex: number };

export type MeasureClickDel = ClickDelegate<MeasureClickArgs>;

export type MeasureComponentClickArgs = {
  measureIndex: number;
  absoluteYPos: number;
};

export type MeasureCompClickDel = ClickDelegate<MeasureComponentClickArgs>;

export type AbsolutePositionConverter = UnitConverter<number, number>;

export type ClickableOverlayContext = {
  topLeft: Coordinate;
  width: number;
  height: number;
  onClick: () => void;
};

export interface IClickHandlerAttachment<T, E> {
  attachHandler(identifiers: T): E;
}

export type MeasureIdentifier = { measureIndex: number };

export type NoteIdentifier = { measureIndex: number; noteIndex: number };

export type MeasureComponentIdentifier = {
  measureIndex: number;
  absoluteYPos: number;
};
