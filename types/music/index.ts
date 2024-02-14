export type Pitch = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

// An array of length 7 where each element is a pitch and cannot be a duplicate pitch
export type PitchMapping = [Pitch, Pitch, Pitch, Pitch, Pitch, Pitch, Pitch];

export type PitchOctaveHelper = {
	pitchMapping: PitchMapping;
	baseOctave: number;
	cOffset: number;
};
