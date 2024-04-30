import { Clef, Pitch, PitchOctave } from '@/types/music';
import { getYPosFromNote } from '.';

const sharpsOrdering: Pitch[] = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
const flatsOrdering: Pitch[] = ['B', 'E', 'A', 'D', 'G', 'C', 'F'];

const getOrderingIndex = (keySignature: number) => {
	let i = Math.abs(keySignature) - 1;
	if (i >= 7) return null;
	else return i;
};

export const applyKeySignature = (
	keySignature: number,
	pitchOctave: PitchOctave
) => {
	if (keySignature === 0) return;

	const pitchOrdering = keySignature < 0 ? flatsOrdering : sharpsOrdering;
	const { pitch } = pitchOctave;

	// Invalid if keySignature was originally anything above 7 or below -7
	/* let i = Math.abs(keySignature) - 1;
	if (i >= 7) return; */
	let i = getOrderingIndex(keySignature);
	if (i === null) return;

	while (i >= 0) {
		if (pitch === pitchOrdering[i]) {
			pitchOctave.accidental = keySignature < 0 ? 'b' : '#';
			return;
		}

		i -= 1;
	}
};

// Gets the y positions of each of the flats or sharps that should occur in the key signature
export const getYPositionsForKeySignature = (
	keySignature: number,
	clef: Clef
) => {
	let i = getOrderingIndex(keySignature);
	// If i is 0 or null just return any empty array (correct return value for i = 0)
	if (!i) return [];

	const pitchOrdering = keySignature < 0 ? flatsOrdering : sharpsOrdering;
	const positions: number[] = [];
	while (i >= 0) {
		// Create a dummy pitch octave
		const pitchOctave: PitchOctave = {
			pitch: pitchOrdering[i].toString() as Pitch,
			octave: 3,
		};
		let yPos = getYPosFromNote(pitchOctave, clef);

		// Get yPos between 0 - 6 using steps of 7 (the number of different note letters there are)
		// -13 % 7 = -6 + 7 = 1 % 7 = 1
		// -28 % 7 = 0 + 7 = 7 % 7 = 0
		// 3 % 7 = 3 + 7 = 10 % 7 = 3
		// 13 % 7 = 6 + 7 = 13 % 7 = 6
		yPos = ((yPos % 7) + 7) % 7;
		positions.push(yPos);
		i--;
	}

	return positions;
};
