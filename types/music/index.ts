// TODO: Switch this file to be called 'measure-attributes' in dev branch

import { Measure, TimeSignature } from "@/components/providers/music/types";
import { Dynamic } from "./note-annotations";

export const numberNoteTypes = [1, 2, 4, 8, 16, 32, 64];

export type Pitch = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export type PitchOctave = {
  pitch: Pitch;
  octave: number;
  accidental?: "b" | "#";
};

export type MusicPart = {
  attributes: MusicPartAttributes;
  measures: Measure[];
};

export type MusicPartAttributes = {
  instrument: string;
  id: string;
  name: string;
};

export type Clef =
  | "treble"
  | "alto"
  | "bass"
  | "baritone"
  | "tenor"
  | "soprano";

/* export type Wedge = {
	crescendo: boolean;
	// Don't need to store start values because it's indicated by the measure attributes it's apart of
	measureEnd: number;
	xEnd: number;
};
 */

/* type ForwardRepeat = {
	forward: true;
};

type BackwardRepeat = {
  forward: false;
  jumpMeasure: number;
  repeatCount: number;
  remainingRepeats: number;
};

export type Repeat = ForwardRepeat | BackwardRepeat; */

// Stores whether this is the beginning of the wedge, and if so, what type
export type Wedge =
  | {
      start: false;
    }
  | {
      start: true;
      crescendo: boolean;
    };

// Stores if the repeat is forward or backward-looking
export type Repeat =
  | {
      forward: true;
    }
  | {
      forward: false;
      repeatCount: number;
    };

// Maps the endings that occur on the measure and their type
// NOTE: A measure in the middle of an ending won't have an 'ending' attribute
export type RepeatEndings = {
  endings: number[];
  type: RepeatEndingType;
};

export type RepeatEndingType = "start" | "stop" | "discontinue";

// Maps an ending number (1st ending, 2nd ending, etc.) to the measure number that it ends at
// The ending starts at the measure the object is located in
/* export type RepeatEndings = {
	[ending in number]: number;
}; */

export type MusicScore = {
  title: string;
  parts: MusicPart[];
};

export type Metronome = {
  beatNote: number;
  beatsPerMinute: number;
};

// Static attributes are ones that possibly change 1 time in the measure (either at the beginning or end),
// or not at all
export const staticMeasureAttributesKeys = new Set<keyof MeasureAttributes>([
  "timeSignature",
  "keySignature",
  "clef",
  "repeat",
  "repeatEndings",
]);

// Dynamic attributes are ones that occur many times within a measure and have no set
// position of where they need to be, or how many there can be
export const dynamicMeasureAttributesKeys = new Set<keyof MeasureAttributes>([
  "metronome",
  "dynamic",
  "wedge",
]);

// Duration attributes are ones that stretch past their initial occurrence
// For instance, a wedge (i.e. crescendo/decrescendo) gets initialized at some point in the measure
// and stretches to another point
export const getDurationMeasureAttributes = () =>
  new Set<keyof MeasureAttributes>(["wedge", "repeat", "repeatEndings"]);

export type StaticMeasureAttributes = {
  timeSignature: TimeSignature;
  keySignature: number;
  clef: Clef;
  repeat?: Repeat;
  repeatEndings?: RepeatEndings;
};

export type DynamicMeasureAttributes = {
  metronome: Metronome;
  dynamic: Dynamic;
  wedge?: Wedge;
};

export type MeasureAttributes = StaticMeasureAttributes &
  DynamicMeasureAttributes;

export type PartialMeasureAttributes = Partial<MeasureAttributes>;

export type TemporalMeasureAttributes = {
  x: number;
  attributes: Partial<DynamicMeasureAttributes>;
};

export type MeasureAttributesMXML = MeasureAttributes & {
  quarterNoteDivisions: number;
};

export type MeasureTimeSignautreCallback = (
  measureIndex: number
) => TimeSignature;

export type MeasureWidthCallback = (measureIndex: number) => number;

export type TemporalMeasureAttributesMXML = TemporalMeasureAttributes &
  MeasureAttributesMXML;

export type MeasureSectionMetadata = {
  timeSignature: TimeSignature;
  repeat: Repeat;
};

export type MeasureSection = keyof MeasureSectionMetadata;
