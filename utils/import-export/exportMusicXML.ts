import { getNoteDuration } from '@/components/providers/music/utils';
import { getNoteFromYPos } from '../music-modifier';
import { createAppend } from './xml-helpers';
import { MusicPart, MusicScore, Pitch, PitchOctaveHelper } from '@/types/music';
import { NoteType, TimeSignature } from '@/components/providers/music/types';
import { segmentGen1 } from '../segments/segment-gen-1';

const createRestsXML = (
	root: XMLDocument,
	xPos1: number,
	xPos2: number,
	measureXML?: Element
) => {
	const restsData = segmentGen1(xPos1, xPos2);

	const restsXML: Element[] = [];
	restsData.map((restData) => {
		for (let i = 0; i < restData.count; i++) {
			const noteXML = root.createElement('note');
			createAppend(root, noteXML, 'rest');
			const duration = createAppend(root, noteXML, 'duration');
			duration.textContent = restData.segmentBeat.toString();

			if (measureXML) measureXML.appendChild(noteXML);
			restsXML.push(noteXML);
		}
	});

	return restsXML;
};

const createNoteXML = (
	root: XMLDocument,
	yPos: number,
	pitchOctaveHelper: PitchOctaveHelper,
	type: NoteType,
	timeSignature: TimeSignature
) => {
	const boundCA = createAppend.bind(this, root);

	const pitchOctave = getNoteFromYPos(yPos, pitchOctaveHelper);
	const pitch = pitchOctave.slice(0, -1) as Pitch;
	const octave = pitchOctave.slice(-1);
	const duration = getNoteDuration(type, timeSignature.beatNote);

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

// TODO: Take in clef and key signature
const createMeasureXML = (
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

const createPartListXML = (root: XMLDocument, parts: MusicPart[]) => {
	const partList = root.createElement('part-list');

	for (const part of parts) {
		const scorePart = createAppend(root, partList, 'score-part');
		scorePart.setAttribute('id', part.id);

		const pName = createAppend(root, scorePart, 'part-name');
		pName.textContent = part.instrument;
	}

	return partList;
};

// TODO: Extract each loop into its own method ; calculate rests between notes (getSegments) ; add title and instrument appropriately
export const createMusicXMLScore = (score: MusicScore) => {
	const { title, parts, pitchOctaveHelper, timeSignature } = score;
	const { beatNote, beatsPerMeasure } = timeSignature;

	const header =
		'<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE score-partwise><score-partwise></score-partwise>';
	const root = new DOMParser().parseFromString(header, 'application/xml');

	const scoreXML = root.getElementsByTagName('score-partwise')[0];
	scoreXML.setAttribute('version', '4.0');

	const partListXML = createPartListXML(root, parts);
	scoreXML.appendChild(partListXML);

	for (let i = 0; i < parts.length; i++) {
		const { measures, id, instrument } = parts[i];

		const partXML = createAppend(root, scoreXML, 'part');
		partXML.setAttribute('id', id);

		for (let j = 0; j < measures.length; j++) {
			const { notes } = measures[j];

			const measureXML = createMeasureXML(root, j + 1, timeSignature);
			partXML.appendChild(measureXML);

			createRestsXML(
				root,
				0,
				notes.length ? notes[0].x : beatsPerMeasure,
				measureXML
			);

			for (let k = 0; k < notes.length; k++) {
				const { x, y, type } = notes[k];

				const noteXML = createNoteXML(
					root,
					y,
					pitchOctaveHelper,
					type,
					timeSignature
				);
				measureXML.appendChild(noteXML);

				createRestsXML(
					root,
					x + getNoteDuration(type, beatNote),
					k === notes.length - 1 ? beatsPerMeasure : notes[k + 1].x,
					measureXML
				);
			}
		}
	}

	return root;
};
