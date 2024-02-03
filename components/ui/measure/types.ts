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
  x: number; //Should be measure independent
  y: number;
  type: NoteType;
}

export type SegmentBeat = 4 | 2 | 1 | 0.5 | 0.25 | 0.125;

export type KeySignature = {
  beatsPerMeasure: number;
  beatNote: number /*Make this more strict later */;
};

export type SegmentData = {
  beatPercentage: SegmentBeat;
  xPos: number;
  notes?: Note[];
};

export type SegmentDelegates = {
  onNotePlaced: (note: Note) => void;
  onNoteRemoved: (yPos: number) => void;
};

export type SegmentProps = {
  width: number;
  noteValidator: (xPos: number, yPos: number, noteType: NoteType) => boolean;
} & SegmentData &
  SegmentDelegates;

export type SegmentMap = { [beat in SegmentBeat]?: number };
export type SegmentOrder = "increasing" | "decreasing";

export type SegmentGenerator = (
  xPosOne: number,
  xPosTwo: number
) => { segments: SegmentMap; segmentOrder?: SegmentOrder };

export type MeasureProps = {
  segmentGenerator: SegmentGenerator;
  renderSegment: (props: SegmentProps) => ReactNode;
  notes: Note[];
  addNote: (note: Note) => void;
  removeNote: (xPos: number, yPos: number) => void;
  keySignature: KeySignature;
};

export type Segment = DoublyLinkedList<SegmentData>;
