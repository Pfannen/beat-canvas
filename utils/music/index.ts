import { Clef, Pitch, PitchMapping, PitchOctaveHelper } from '@/types/music';

const standardPitchMapping: PitchMapping = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const getPitchOctaveHelper = (baseYNote: string) => {
	const pitch = baseYNote[0] as Pitch;
	const baseOctave = +baseYNote[1];

	const cOffset = standardPitchMapping.indexOf(pitch);
	const pitchMapping = standardPitchMapping
		.slice(cOffset)
		.concat(standardPitchMapping.slice(0, cOffset)) as PitchMapping;

	const pitchOctaveHelper: PitchOctaveHelper = {
		pitchMapping,
		baseOctave,
		cOffset,
	};

	return pitchOctaveHelper;
};

export const getPitchOctaveHelperForClef = (clef: Clef) => {
	if (clef === 'alto') return getPitchOctaveHelper('F3');
	else if (clef === 'bass') return getPitchOctaveHelper('G2');
	else return getPitchOctaveHelper('E4');
};

export const getNoteFromYPos = (
	yPos: number,
	pitchOctaveHelper: PitchOctaveHelper
) => {
	const { pitchMapping, baseOctave, cOffset } = pitchOctaveHelper;

	let pitchDist = yPos % 7;
	if (pitchDist < 0) pitchDist = 7 + pitchDist;
	const pitch = pitchMapping[pitchDist];

	const octave = Math.floor((yPos + cOffset) / 7) + baseOctave;

	return pitch + octave;
};

export const getYPosFromNote = (
	note: string,
	pitchOctaveHelper: PitchOctaveHelper
) => {
	const { baseOctave, pitchMapping, cOffset } = pitchOctaveHelper;

	// how many steps away are we from base octave and pitch
	const pitch = note[0];
	const octave = +note[1];

	let steps = (octave - baseOctave) * 7;
	if (steps > 0) steps -= cOffset;
	else steps += cOffset;

	let pitchDist = pitchMapping[0].charCodeAt(0) - pitch.charCodeAt(0);
	const pitchDistSign = Math.sign(pitchDist);
	pitchDist = Math.abs(pitchDist);
	if (pitchDist > 4) pitchDist = 7 - pitchDist;

	if (steps >= 0) steps += pitchDist;
	else steps -= pitchDist;
	console.log(steps);

	return steps;
};

export const getSecondsPerBeat = (bpm: number) => 1 / (bpm / 60);

export const getMeasureXStart = (xPos: number, beatsPerMeasure: number) =>
	Math.floor(xPos / beatsPerMeasure);
