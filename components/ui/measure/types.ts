import { DoublyLinkedList } from "@/types";
import { ReactNode } from "react";

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

export type SegmentData = {
  onNotePlaced: (note: Note) => void;
  onNoteRemoved: (yPos: number) => void;
  notes?: Note[];
};

export type SegmentProps = {
  width: number;
  xPos: number;
  noteValidator: (xPos: number, yPos: number, noteType: NoteType) => boolean;
} & SegmentData;

export type SegmentBeats = 1 | 0.5 | 0.25 | 0.125;
export type SegmentMap = { [beat in SegmentBeats]?: number };

export type SegmentGenerator = (xPosOne: number, xPosTwo: number) => SegmentMap;

export type MeasureProps = {
  segmentGenerator: SegmentGenerator;
  renderSegment: (props: SegmentProps) => ReactNode;
  notes: Note[];
  addNote: (note: Note) => void;
  removeNote: (xPos: number, yPos: number) => void;
};

export type Segment = DoublyLinkedList<SegmentData>;
