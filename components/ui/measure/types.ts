export type NoteType =
  | "whole"
  | "dotted-half"
  | "half"
  | "dotted-quarter"
  | "quarter"
  | "dotted-eighth"
  | "eighth"
  | "dotted-sixteenth"
  | "sixteenth"
  | "dotted-thirtysecond"
  | "thirtysecond";

export interface Note {
  x: number;
  y: number;
  type: NoteType;
}

export type SegmentProps = {
  width: number;
  xPos: number;
  onNotePlaced: (xPos: number, yPos: number) => void;
  noteValidator: (xPos: number, yPos: number, noteType: NoteType) => boolean;
  note?: Note;
};
