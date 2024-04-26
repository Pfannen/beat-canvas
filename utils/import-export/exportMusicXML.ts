import { getNoteDuration } from '@/components/providers/music/utils';
import { getNoteFromYPos } from '../music';
import { createAppend } from './helpers/xml-helpers';
import { Clef, MeasureAttributes, MusicPart, MusicScore } from '@/types/music';
import {
	Measure,
	Note,
	TimeSignature,
} from '@/components/providers/music/types';
import { clefToMusicXML, convertJSNoteTypeToMusicXML } from '../musicXML';
import { minimalSegmentGenerator } from '../segments/segment-gen-1';
import Helper from './helpers/ExportMusicXMLHelper';

// *WARNING*: OUTDATED

const createNoteXML = (
	root: XMLDocument,
	measureXML: Element,
	note: Note,
	clef: Clef,
	beatNote: number
) => {
	const boundCA = createAppend.bind(this, root);
	const { y, type } = note;
	const { pitch, octave } = getNoteFromYPos(y, clef);

	const noteXML = boundCA(measureXML, 'note');

	const pitchXML = boundCA(noteXML, 'pitch');
	const stepXML = boundCA(pitchXML, 'step');
	stepXML.textContent = pitch;
	const octaveXML = boundCA(pitchXML, 'octave');
	octaveXML.textContent = octave.toString();

	const durationXML = boundCA(noteXML, 'duration');
	durationXML.textContent = getNoteDuration(
		note.type,
		beatNote,
		note.annotations?.dotted
	).toString();
	const typeXML = boundCA(noteXML, 'type');
	typeXML.textContent = convertJSNoteTypeToMusicXML(type);

	if (note.annotations?.dotted) boundCA(noteXML, 'dot');
};

const createMeasureNotesXML = (
	root: XMLDocument,
	measureXML: Element,
	notes: Note[],
	timeSignature: TimeSignature,
	clef: Clef
) => {
	const { beatNote, beatsPerMeasure } = timeSignature;

	Helper.createRestsXML(
		root,
		measureXML,
		0,
		notes.length ? notes[0].x : beatsPerMeasure,
		timeSignature
	);

	for (let i = 0; i < notes.length; i++) {
		const note = notes[i];
		createNoteXML(root, measureXML, note, clef, beatNote);
		const duration = getNoteDuration(
			note.type,
			beatNote,
			note.annotations?.dotted
		);

		Helper.createRestsXML(
			root,
			measureXML,
			note.x + duration,
			i === notes.length - 1 ? beatsPerMeasure : notes[i + 1].x,
			timeSignature
		);
	}
};

const createMeasuresXML = (
	root: XMLDocument,
	partXML: Element,
	measures: Measure[]
) => {
	const curAttr: MeasureAttributes = {
		metronome: {
			beatNote: 4,
			beatsPerMinute: 60,
		},
		timeSignature: {
			beatNote: 4,
			beatsPerMeasure: 4,
		},
		clef: 'bass',
		keySignature: 0,
		dynamic: 'p',
	};
	const boundCA = createAppend.bind(this, root);

	for (let i = 0; i < measures.length; i++) {
		const measureXML = boundCA(partXML, 'measure');
		measureXML.setAttribute('number', (i + 1).toString());

		const measure = measures[i];
		Helper.createMeasureAttributesXML(
			root,
			measureXML,
			curAttr,
			measure.staticAttributes
		);
		createMeasureNotesXML(
			root,
			measureXML,
			measure.notes,
			curAttr.timeSignature!,
			curAttr.clef!
		);
	}
};

const createPartListXML = (root: XMLDocument, parts: MusicPart[]) => {
	const partList = root.createElement('part-list');

	for (const part of parts) {
		const scorePart = createAppend(root, partList, 'score-part');

		const { id, instrument } = part.attributes;
		scorePart.setAttribute('id', id);

		const pName = createAppend(root, scorePart, 'part-name');
		pName.textContent = instrument;
	}

	return partList;
};

// TODO: Add title and instrument appropriately
export const createMusicXMLScore = (score: MusicScore) => {
	const { title, parts } = score;

	const [root, scoreXML] = Helper.createMusicXMLScorePartwise(title);

	const partListXML = createPartListXML(root, parts);
	scoreXML.appendChild(partListXML);

	for (let i = 0; i < parts.length; i++) {
		const { measures, attributes: partAttributes } = parts[i];

		const partXML = createAppend(root, scoreXML, 'part');
		partXML.setAttribute('id', partAttributes.id);

		createMeasuresXML(root, partXML, measures);
	}

	return root;
};
