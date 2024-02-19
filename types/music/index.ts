import { Measure, TimeSignature } from '@/components/providers/music/types';

export type Pitch = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

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
