import { NoteDirection } from "@/lib/notes/types";
import { NoteAnnotations } from "./note-annotations";

export type BeamData = { angle: number; length: number; number: number };

export type NoteAttachmentData = {
  beamData: BeamData[];
  isBeamed: boolean;
  nonBodyData: { numLines: number; isOnLine: boolean; isAboveBody: boolean }; // If this is undefined the note is a body component (where this information doesn't apply)
}; //Data that isn't defined by the user (such as a stacatto) but rather defined by musical notation

export type NoteDrawData = {} & NoteAnnotations;

export type NoteDisplayData = {
  stemOffset?: number;
  noteDirection: NoteDirection;
} & Partial<NoteAttachmentData>;

export type MeasurePositionData = {};
