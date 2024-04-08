import { Clef, Pitch, PitchOctave } from '../../../types/music';
import { getNoteFromYPos } from '../../../utils/music';
import { equal } from 'assert';

const aCharCode = 'A'.charCodeAt(0);
const cCharCode = 'C'.charCodeAt(0);
const gCharCode = 'G'.charCodeAt(0);

const updatePitchOctave = (
	pO: { pitch: number; octave: number },
	inc: -1 | 1
) => {
	pO.pitch += inc;

	if (pO.pitch > gCharCode) pO.pitch = aCharCode;
	else if (pO.pitch < aCharCode) pO.pitch = gCharCode;
	if (inc === 1 && pO.pitch === cCharCode) pO.octave += 1;
	else if (inc === -1 && pO.pitch === cCharCode - 1) pO.octave -= 1;
};

// #region increasing

test('Increasing y-pos from treble clef', () => {
	const clef: Clef = 'treble';
	const pO = {
		pitch: 'E'.charCodeAt(0),
		octave: 4,
	};

	for (let i = 0; i < 30; i++) {
		const { pitch, octave } = getNoteFromYPos(i, clef);
		equal(pitch + octave, String.fromCharCode(pO.pitch) + pO.octave);
		updatePitchOctave(pO, 1);
	}
});

test('Increasing y-pos from alto clef', () => {
	const clef: Clef = 'alto';
	const pO = {
		pitch: 'F'.charCodeAt(0),
		octave: 3,
	};

	for (let i = 0; i < 30; i++) {
		const { pitch, octave } = getNoteFromYPos(i, clef);
		equal(pitch + octave, String.fromCharCode(pO.pitch) + pO.octave);
		updatePitchOctave(pO, 1);
	}
});

test('Increasing y-pos from bass clef', () => {
	const clef: Clef = 'bass';
	const pO = {
		pitch: 'G'.charCodeAt(0),
		octave: 2,
	};

	for (let i = 0; i < 30; i++) {
		const { pitch, octave } = getNoteFromYPos(i, clef);
		equal(pitch + octave, String.fromCharCode(pO.pitch) + pO.octave);
		updatePitchOctave(pO, 1);
	}
});

test('Increasing y-pos from baritone clef', () => {
	const clef = 'baritone';
	const pO = {
		pitch: 'B'.charCodeAt(0),
		octave: 2,
	};

	for (let i = 0; i < 30; i++) {
		const { pitch, octave } = getNoteFromYPos(i, clef);
		equal(pitch + octave, String.fromCharCode(pO.pitch) + pO.octave);
		updatePitchOctave(pO, 1);
	}
});

test('Increasing y-pos from soprano clef', () => {
	const clef = 'soprano';
	const pO = {
		pitch: 'C'.charCodeAt(0),
		octave: 4,
	};

	for (let i = 0; i < 30; i++) {
		const { pitch, octave } = getNoteFromYPos(i, clef);
		equal(pitch + octave, String.fromCharCode(pO.pitch) + pO.octave);
		updatePitchOctave(pO, 1);
	}
});

// #endregion

// #region decreasing

test('Decreasing y-pos from treble clef', () => {
	const clef: Clef = 'treble';
	const pO = {
		pitch: 'E'.charCodeAt(0),
		octave: 4,
	};

	for (let i = 0; i < 30; i++) {
		const { pitch, octave } = getNoteFromYPos(-i, clef);
		equal(pitch + octave, String.fromCharCode(pO.pitch) + pO.octave);
		updatePitchOctave(pO, -1);
	}
});

test('Decreasing y-pos from alto clef', () => {
	const clef: Clef = 'alto';
	const pO = {
		pitch: 'F'.charCodeAt(0),
		octave: 3,
	};

	for (let i = 0; i < 30; i++) {
		const { pitch, octave } = getNoteFromYPos(-i, clef);
		equal(pitch + octave, String.fromCharCode(pO.pitch) + pO.octave);
		updatePitchOctave(pO, -1);
	}
});

test('Decreasing y-pos from bass clef', () => {
	const clef: Clef = 'bass';
	const pO = {
		pitch: 'G'.charCodeAt(0),
		octave: 2,
	};

	for (let i = 0; i < 30; i++) {
		const { pitch, octave } = getNoteFromYPos(-i, clef);
		equal(pitch + octave, String.fromCharCode(pO.pitch) + pO.octave);
		updatePitchOctave(pO, -1);
	}
});

test('Decreasing y-pos from baritone clef', () => {
	const clef: Clef = 'baritone';
	const pO = {
		pitch: 'B'.charCodeAt(0),
		octave: 2,
	};

	for (let i = 0; i < 30; i++) {
		const { pitch, octave } = getNoteFromYPos(-i, clef);
		equal(pitch + octave, String.fromCharCode(pO.pitch) + pO.octave);
		updatePitchOctave(pO, -1);
	}
});

test('Decreasing y-pos from soprano clef', () => {
	const clef: Clef = 'soprano';
	const pO = {
		pitch: 'C'.charCodeAt(0),
		octave: 4,
	};

	for (let i = 0; i < 30; i++) {
		const { pitch, octave } = getNoteFromYPos(-i, clef);
		equal(pitch + octave, String.fromCharCode(pO.pitch) + pO.octave);
		updatePitchOctave(pO, -1);
	}
});

// #endregion
