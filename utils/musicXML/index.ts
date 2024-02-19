import { Clef, Pitch } from '@/types/music';

export const clefToMusicXML = (clef: Clef) => {
	if (clef === 'alto') return 'F1';
	else if (clef === 'bass') return 'G1';
	else return 'E1';
};

export const musicXMLToClef = (pitch: Pitch, lineNumber: number): Clef => {
	const pitchDrops = ((lineNumber - 1) * 2) % 7;
	let pitchCharCode = pitch.charCodeAt(0) - pitchDrops;
	if (pitchCharCode < 'A'.charCodeAt(0))
		pitchCharCode = pitch.charCodeAt(0) + (7 - pitchDrops);
	const newPitch = String.fromCharCode(pitchCharCode);

	if (newPitch === 'F') return 'alto';
	else if (newPitch === 'G') return 'bass';
	else return 'treble';
};
