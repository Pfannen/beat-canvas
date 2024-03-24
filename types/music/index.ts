import { Measure, TimeSignature } from '@/components/providers/music/types';
import { Dynamic } from './note-annotations';

export type Pitch = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export type PitchOctave = {
	pitch: Pitch;
	octave: number;
	accidental?: 'b' | '#';
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

export type MusicScore = {
	title: string;
	parts: MusicPart[];
};

export type Metronome = {
	beatNote: number;
	beatsPerMinute: number;
};

export type MeasureAttributes = {
	metronome: Metronome;
	timeSignature: TimeSignature;
	keySignature: number;
	clef: Clef;
	dynamic: Dynamic;
	repeat?: Repeat;
	wedge?: Wedge;
};

export type PartialMeasureAttributes = Partial<MeasureAttributes>;

export type TemporalMeasureAttributes = {
	x: number;
	attributes: Partial<MeasureAttributes>;
};

export type MeasureAttributesMXML = MeasureAttributes & {
	quarterNoteDivisions: number;
};

export type TemporalMeasureAttributesMXML = TemporalMeasureAttributes &
	MeasureAttributesMXML;
