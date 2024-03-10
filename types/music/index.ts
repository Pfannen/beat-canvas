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
};

export type PartialMeasureAttributes = Partial<MeasureAttributes>;

export type TemporalMeasureAttributes = {
	x: number;
	attributes: Partial<MeasureAttributes>;
};

export type MeasureAttributesMXML = MeasureAttributes & {
	quarterNoteDivisions: number;
};

export type TimedMeasureAttributesMXML = TemporalMeasureAttributes &
	MeasureAttributesMXML;
