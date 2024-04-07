import { UnitConverter } from "@/types";
import { Coordinate } from "@/objects/measurement/types";

export type ClickDelegate = (index: number) => void;

export type NoteClickDel = (measureIndex: number, noteIndex: number) => void;

export type AbsolutePositionConverter = UnitConverter<number, number>;

export type ClickableOverlayContext<T> = {
  topLeft: Coordinate;
  width: number;
  height: number;
  indentifiers: T;
};

export type ClickHandlerAttachmentContext<T, E> = {
  element: E;
  indentifiers: T;
};

export interface IClickableOverlay<T> {
  createOverlay(context: ClickableOverlayContext<T>): void;
}

export interface IClickHandlerAttachment<T, E> {
  attachHandler(context: ClickHandlerAttachmentContext<T, E>): void;
}

export type MeasureIdentifier = { measureIndex: number };

export type NoteIdentifier = { measureIndex: number; noteIndex: number };
