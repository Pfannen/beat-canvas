import { Clef, Pitch, PitchOctave } from '../../../types/music';
import { getYPosFromNote } from '../../../utils/music';
import { equal } from 'assert';

const aCC = 'A'.charCodeAt(0);
const cCC = 'C'.charCodeAt(0);
const gCC = 'G'.charCodeAt(0);

const updatePitchOctave = (pitchOctave: PitchOctave, inc: boolean) => {
	let charCode = pitchOctave.pitch.charCodeAt(0);
	if (inc) {
		charCode += 1;
		if (charCode > gCC) charCode = aCC;
		else if (charCode === cCC) pitchOctave.octave += 1;
	} else {
		charCode -= 1;
		if (charCode < aCC) charCode = gCC;
		else if (charCode === cCC - 1) pitchOctave.octave -= 1;
	}

	pitchOctave.pitch = String.fromCharCode(charCode) as Pitch;
};

// #region increasing

test('Incresing note from treble clef', () => {
	const clef: Clef = 'treble';
	const pO: PitchOctave = {
		pitch: 'E',
		octave: 4,
	};

	for (let i = 0; i < 30; i++) {
		equal(getYPosFromNote(pO, clef), i);
		updatePitchOctave(pO, true);
	}
});

test('Incresing note from alto clef', () => {
	const clef: Clef = 'alto';
	const pO: PitchOctave = {
		pitch: 'F',
		octave: 3,
	};

	for (let i = 0; i < 30; i++) {
		equal(getYPosFromNote(pO, clef), i);
		updatePitchOctave(pO, true);
	}
});

test('Incresing note from bass clef', () => {
	const clef: Clef = 'bass';
	const pO: PitchOctave = {
		pitch: 'G',
		octave: 2,
	};

	for (let i = 0; i < 30; i++) {
		equal(getYPosFromNote(pO, clef), i);
		updatePitchOctave(pO, true);
	}
});

test('Incresing note from baritone clef', () => {
	const clef: Clef = 'baritone';
	const pO: PitchOctave = {
		pitch: 'B',
		octave: 2,
	};

	for (let i = 0; i < 30; i++) {
		equal(getYPosFromNote(pO, clef), i);
		updatePitchOctave(pO, true);
	}
});

test('Incresing note from soprano clef', () => {
	const clef: Clef = 'soprano';
	const pO: PitchOctave = {
		pitch: 'C',
		octave: 4,
	};

	for (let i = 0; i < 30; i++) {
		equal(getYPosFromNote(pO, clef), i);
		updatePitchOctave(pO, true);
	}
});

// #endregion increasing

// #region decreasing

test('Decreasing note from treble clef', () => {
	const clef: Clef = 'treble';
	const pO: PitchOctave = {
		pitch: 'E',
		octave: 4,
	};

	for (let i = 0; i < 30; i++) {
		equal(getYPosFromNote(pO, clef), -i);
		updatePitchOctave(pO, false);
	}
});

test('Decreasing note from alto clef', () => {
	const clef: Clef = 'alto';
	const pO: PitchOctave = {
		pitch: 'F',
		octave: 3,
	};

	for (let i = 0; i < 30; i++) {
		equal(getYPosFromNote(pO, clef), -i);
		updatePitchOctave(pO, false);
	}
});

test('Decreasing note from bass clef', () => {
	const clef: Clef = 'bass';
	const pO: PitchOctave = {
		pitch: 'G',
		octave: 2,
	};

	for (let i = 0; i < 30; i++) {
		equal(getYPosFromNote(pO, clef), -i);
		updatePitchOctave(pO, false);
	}
});

test('Decreasing note from baritone clef', () => {
	const clef: Clef = 'baritone';
	const pO: PitchOctave = {
		pitch: 'B',
		octave: 2,
	};

	for (let i = 0; i < 30; i++) {
		equal(getYPosFromNote(pO, clef), -i);
		updatePitchOctave(pO, false);
	}
});

test('Decreasing note from soprano clef', () => {
	const clef: Clef = 'soprano';
	const pO: PitchOctave = {
		pitch: 'C',
		octave: 4,
	};

	for (let i = 0; i < 30; i++) {
		equal(getYPosFromNote(pO, clef), -i);
		updatePitchOctave(pO, false);
	}
});

// #endregion decreasing
