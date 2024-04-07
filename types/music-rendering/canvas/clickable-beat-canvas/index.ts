import { UnitConverter } from "@/types";
import { Coordinate } from "@/objects/measurement/types";
import { ComponentProps } from "react";

export type ClickDelegate = (index: number) => void;

export type NoteClickDel = (measureIndex: number, noteIndex: number) => void;

export type MeasureComponentClickDel = (
  measureIndex: number,
  yPos: number
) => void;

export type AbsolutePositionConverter = UnitConverter<number, number>;

export type ClickableOverlayContext<T> = {
  topLeft: Coordinate;
  width: number;
  height: number;
  indentifiers: T;
};

export interface IClickableOverlay<T> {
  createOverlay(context: ClickableOverlayContext<T>): void;
}

export interface IClickHandlerAttachment<T, E> {
  attachHandler(indentifiers: T): E;
}

export type MeasureIdentifier = { measureIndex: number };

export type NoteIdentifier = { measureIndex: number; noteIndex: number };

export type MeasureComponentIdentifier = {
  measureIndex: number;
  absoluteYPos: number;
};
