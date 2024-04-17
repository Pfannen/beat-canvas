import {
	Measure,
	NoteType,
	TimeSignature,
} from '@/components/providers/music/types';
import { Dynamic } from './note-annotations';

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
	| 'treble'
	| 'alto'
	| 'bass'
	| 'baritone'
	| 'tenor'
	| 'soprano';

export type Wedge = {
	crescendo: boolean;
	// Don't need to store start values because it's indicated by the measure attributes it's apart of
	measureEnd: number;
	xEnd: number;
};

type ForwardRepeat = {
	forward: true;
};

type BackwardRepeat = {
	forward: false;
	jumpMeasure: number;
	repeatCount: number;
	remainingRepeats: number;
};

export type Repeat = ForwardRepeat | BackwardRepeat;

export type RepeatEndingType = 'start' | 'stop' | 'discontinue' | 'start-stop';

// Maps an ending number (1st ending, 2nd ending, etc.) to the measure number that it ends at
// The ending starts at the measure the object is located in
export type RepeatEndings = {
	[ending in number]: number;
};

export type MusicScore = {
  title: string;
  parts: MusicPart[];
};

export type Metronome = {
  beatNote: number;
  beatsPerMinute: number;
};

export const staticMeasureAttributesKeys = new Set<keyof MeasureAttributes>([
	'timeSignature',
	'keySignature',
	'clef',
	'repeat',
	'repeatEndings',
]);

export const dynamicMeasureAttributesKeys = new Set<keyof MeasureAttributes>([
	'metronome',
	'dynamic',
	'wedge',
]);

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
