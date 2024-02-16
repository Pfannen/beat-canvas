import { NoteType, TimeSignature } from '@/components/providers/music/types';
import { MusicPart, Pitch, PitchOctaveHelper } from '@/types/music';
import { getNoteFromYPos } from '../music-modifier';
import { getNoteDuration } from '@/components/providers/music/utils';

export const createAppend = (
	root: XMLDocument,
	parent: Element,
	childName: string
) => {
	const child = root.createElement(childName);
	parent.appendChild(child);
	return child;
};

export const createPartListXML = (root: XMLDocument, parts: MusicPart[]) => {
	const partList = root.createElement('part-list');

	for (const part of parts) {
		const scorePart = createAppend(root, partList, 'score-part');
		scorePart.setAttribute('id', part.id);

		const pName = createAppend(root, scorePart, 'part-name');
		pName.textContent = part.instrument;
	}

	return partList;
};

// TODO: Take in clef and key signature
export const createMeasureXML = (
	root: XMLDocument,
	measureNumber: number,
	timeSignature: TimeSignature
) => {
	const boundCA = createAppend.bind(this, root);

	const measure = root.createElement('measure');
	measure.setAttribute('number', measureNumber.toString());

	const attributes = boundCA(measure, 'attributes');
	const divisions = boundCA(attributes, 'divisions');
	divisions.textContent = (timeSignature.beatNote / 4).toString();

	const key = boundCA(attributes, 'key');
	const fifths = boundCA(key, 'fifths');
	fifths.textContent = '0';

	const time = boundCA(attributes, 'time');
	const beats = boundCA(time, 'beats');
	beats.textContent = timeSignature.beatsPerMeasure.toString();
	const beatType = boundCA(time, 'beat-type');
	beatType.textContent = timeSignature.beatNote.toString();

	// Resembles treble clef
	const clef = boundCA(attributes, 'clef');
	const sign = boundCA(clef, 'sign');
	sign.textContent = 'G';
	const line = boundCA(clef, 'line');
	line.textContent = '2';

	return measure;
};

export const createNoteXML = (
	root: XMLDocument,
	pitch: Pitch,
	octave: string,
	duration: number,
	type: string
) => {
	const boundCA = createAppend.bind(this, root);

	const note = root.createElement('note');

	const pitchXML = boundCA(note, 'pitch');
	const stepXML = boundCA(pitchXML, 'step');
	stepXML.textContent = pitch;
	const octaveXML = boundCA(pitchXML, 'octave');
	octaveXML.textContent = octave.toString();

	const durationXML = boundCA(note, 'duration');
	durationXML.textContent = duration.toString();
	const typeXML = boundCA(note, 'type');
	typeXML.textContent = type;

	return note;
};
