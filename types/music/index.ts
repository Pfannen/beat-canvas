import { Measure, TimeSignature } from '@/components/providers/music/types';

export type Pitch = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

// An array of length 7 where each element is a pitch
export type PitchMapping = [Pitch, Pitch, Pitch, Pitch, Pitch, Pitch, Pitch];

export type PitchOctaveHelper = {
	pitchMapping: PitchMapping;
	baseOctave: number;
	cOffset: number;
};

export type MusicPart = {
	instrument: string;
	id: string;
	measures: Measure[];
};

export type Clef = 'treble' | 'alto' | 'bass';

export type MusicScore = {
	title: string;
	parts: MusicPart[];
};

export type Metronome = {
	beatNote: number;
	beatsPerMinute: number;
};

export type MeasureAttributes = {
	metronome?: Metronome;
	timeSignature?: TimeSignature;
	keySignature?: string;
	clef?: Clef;
};

export type MeasureAttributesMXML = MeasureAttributes & {
	quarterNoteDivisions?: number;
};
