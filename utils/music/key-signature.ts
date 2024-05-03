import { Clef, Pitch, PitchOctave } from '@/types/music';
import { getYPosFromNote } from '.';

const sharpsOrdering: Pitch[] = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
const flatsOrdering: Pitch[] = ['B', 'E', 'A', 'D', 'G', 'C', 'F'];

// Returns the index in the array of the last pitch that's in the given key signature
const getOrderingIndex = (keySignature: number) => {
	let i = Math.abs(keySignature) - 1;
	if (i >= 7 || i < 0) return null;
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
	// If key signature is 0 or just return any empty array (correct return value for key of C)
	if (!keySignature) return [];
	let i = getOrderingIndex(keySignature);
	if (i === null) return [];

	const pitchOrdering = keySignature < 0 ? flatsOrdering : sharpsOrdering;
	const positions: number[] = [];
	for (let j = 0; j <= i; j++) {
		// Create a dummy pitch octave
		const pitchOctave: PitchOctave = {
			pitch: pitchOrdering[j].toString() as Pitch,
			octave: 3,
		};
		let yPos = getYPosFromNote(pitchOctave, clef);

		// Get yPos between 0 - 6 using steps of 7 (the number of different note letters there are)
		// -13 % 7 = -6 + 7 = 1 % 7 = 1
		// -28 % 7 = 0 + 7 = 7 % 7 = 0
		// 3 % 7 = 3 + 7 = 10 % 7 = 3
		// 13 % 7 = 6 + 7 = 13 % 7 = 6
		yPos = ((yPos % 7) + 7) % 7;
		// The lines of a measure can specify the same note in different octaves - we want to
		// use the highest octave of a note that fits within the measures lines 
		// (there's 8 total places within a measure's lines, excluding the top line)
		if (yPos + 7 <= 8) yPos += 7;
		positions.push(yPos);
	}

	return positions;
};
