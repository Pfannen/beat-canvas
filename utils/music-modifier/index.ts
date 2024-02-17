import { Pitch, PitchMapping, PitchOctaveHelper } from '@/types/music';

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

export const getSecondsPerBeat = (bpm: number) => 1 / (bpm / 60);

export const getMeasureXStart = (xPos: number, beatsPerMeasure: number) =>
	Math.floor(xPos / beatsPerMeasure);
