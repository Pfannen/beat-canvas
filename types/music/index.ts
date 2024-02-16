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

export type MusicScore = {
	title: string;
	parts: MusicPart[];
	pitchOctaveHelper: PitchOctaveHelper;
	beatsPerMinute: number; // will need to move these last three to the Measure type
	timeSignature: TimeSignature;
	keySignature: string;
};
