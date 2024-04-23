import { NoteDirection } from "@/lib/notes/types";
import { NoteAnnotations } from "./note-annotations";
import { NoteType } from "@/components/providers/music/types";

export type NoteAttachmentData = {
  beamData: { angle: number; length: number };
  beamNeighbors: { left?: NoteType; right?: NoteType };
  nonBodyData: { numLines: number; isOnLine: boolean; isAboveBody: boolean }; // If this is undefined the note is a body component (where this information doesn't apply)
}; //Data that isn't defined by the user (such as a stacatto) but rather defined by musical notation

export type NoteDrawData = {} & NoteAnnotations;

export type NoteDisplayData = {
  stemOffset?: number;
  noteDirection: NoteDirection;
} & Partial<NoteAttachmentData>;

export type MeasurePositionData = {};
