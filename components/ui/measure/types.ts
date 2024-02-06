import {
  KeySignature,
  Note,
  NoteType,
  SegmentBeat,
} from "@/components/providers/music/types";
import { DoublyLinkedList } from "@/types";
import { ReactNode } from "react";

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
