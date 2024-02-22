import { Pitch, PitchOctave } from '@/types/music';

const sharpsOrdering: Pitch[] = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
const flatsOrdering: Pitch[] = ['B', 'E', 'A', 'D', 'G', 'C', 'F'];

export const applyKeySignature = (
	keySignature: number,
	pitchOctave: PitchOctave
) => {
	if (keySignature === 0) return;

	const pitchOrdering = keySignature < 0 ? flatsOrdering : sharpsOrdering;
	const { pitch } = pitchOctave;

    // Invalid if keySignature was originally anything above 7 or below -7
	let i = Math.abs(keySignature) - 1;
	if (i >= 7) return;

	while (i >= 0) {
		if (pitch === pitchOrdering[i]) {
			pitchOctave.accidental = keySignature < 0 ? 'b' : '#';
			return;
		}

		i -= 1;
	}
};
