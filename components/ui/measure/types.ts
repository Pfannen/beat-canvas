import {
  TimeSignature,
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

// export type SegmentDelegates = {
//   onNotePlaced: (note: Note) => void;
//   onNoteRemoved: (yPos: number) => void;
//   noteValidator: (xPos: number, yPos: number, noteType: NoteType) => boolean;
// };

export type SegmentRendererProps = {
  width: number;
} & SegmentData;

export type SegmentActionHandler<T> = (action: T, x: number, y: number) => void;

export type SegmentProps<T> = {
  width: number;
  actionHandler: SegmentActionHandler<T>;
} & Pick<SegmentData, "xPos" | "beatPercentage">;
// Pick<SegmentDelegates, "noteValidator">;

export type SegmentRenderer = (props: SegmentRendererProps) => ReactNode;

export type SegmentCount = { segmentBeat: SegmentBeat; count: number };

export type SegmentGenerator = (
  xPosOne: number,
  xPosTwo: number
) => SegmentCount[];

export type Segment = DoublyLinkedList<SegmentData>;
