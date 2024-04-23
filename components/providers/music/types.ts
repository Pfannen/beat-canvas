import { NoteDirection } from "@/lib/notes/types";
import {
  StaticMeasureAttributes,
  TemporalMeasureAttributes,
} from "@/types/music";
import { NoteAnnotations } from "@/types/music/note-annotations";

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

export type Note = {
  x: number; //Should be measure independent
  y: number;
  type: NoteType;
  annotations?: NoteAnnotations;
};

export type SegmentBeat = 4 | 2 | 1 | 0.5 | 0.25 | 0.125;

export type TimeSignature = {
  beatsPerMeasure: number;
  beatNote: number /*Make this more strict later */;
};

export type Measure = {
  notes: Note[];
  temporalAttributes?: TemporalMeasureAttributes[];
  staticAttributes?: Partial<StaticMeasureAttributes>;
};
