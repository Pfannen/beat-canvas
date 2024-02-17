import { Measure, Note, NoteType } from '@/components/providers/music/types';
import { MusicPart, MusicScore } from '@/types/music';
import { getPitchOctaveHelper } from '../music-modifier';

const getElements = (
	parent: Element,
	elementName: string,
	triggerError = true
) => {
	const elements = parent.getElementsByTagName(elementName);
	if (elements.length === 0) {
		if (triggerError) console.error(`couldn't get elements for ${elementName}`);
		return null;
	} else return elements;
};

const getMeasureNotesJS = (
	measureXML: Element,
	quarterNoteDivisions: number
) => {
	const noteArr: Note[] = [];

	const noteXMLArr = getElements(measureXML, 'note');
	if (!noteXMLArr) return null;

	let curX = 0;
	for (let i = 0; i < noteXMLArr.length; i++) {
		const noteXML = noteXMLArr[i];

		const durationXMLArr = getElements(noteXML, 'duration');
		if (!durationXMLArr || !durationXMLArr[0].textContent) return null;
		const duration = +durationXMLArr[0].textContent / quarterNoteDivisions;

		const pitchXMLArr = getElements(noteXML, 'pitch', false);
		if (pitchXMLArr) {
			const stepXMLArr = getElements(pitchXMLArr[0], 'step');
			if (!stepXMLArr || !stepXMLArr[0].textContent) return null;
			const step = stepXMLArr[0].textContent;

			const octaveXMLArr = getElements(pitchXMLArr[0], 'octave');
			if (!octaveXMLArr || !octaveXMLArr[0].textContent) return null;
			const octave = octaveXMLArr[0].textContent;

			const pitchOctave = step + octave;

			const typeXMLArr = getElements(noteXML, 'type');
			if (!typeXMLArr || !typeXMLArr[0].textContent) return null;
			const type = typeXMLArr[0].textContent as NoteType;

			// Need a pitchOctave helper to get y position
			noteArr.push({ x: curX, y: 0, type });
		} else {
			const restXMLArr = getElements(noteXML, 'rest', false);
			if (!restXMLArr) {
				console.error('there was neither a pitch nor rest in a measure');
				return null;
			}
		}

		curX += duration;
	}

	return noteArr;
};

const getMeasureAttributesJS = (measureXML: Element) => {
	const attributesXMLArr = getElements(measureXML, 'attributes');
	if (!attributesXMLArr) return null;
	const attributesXML = attributesXMLArr[0];

	const divisionsXMLArr = getElements(attributesXML, 'divisions');
	if (!divisionsXMLArr || !divisionsXMLArr[0].textContent) return null;
	const quarterNoteDivisions = +divisionsXMLArr[0].textContent;

	const timeXMLArr = getElements(attributesXML, 'time');
	if (!timeXMLArr) return null;
	const timeXML = timeXMLArr[0];

	const beatsXMLArr = getElements(timeXML, 'beats');
	if (!beatsXMLArr || !beatsXMLArr[0].textContent) return null;
	const beatsPerMeasure = +beatsXMLArr[0].textContent;

	const beatTypeXMLArr = getElements(timeXML, 'beat-type');
	if (!beatTypeXMLArr || !beatTypeXMLArr[0].textContent) return null;
	const beatType = +beatTypeXMLArr[0].textContent;

	return {
		timeSignature: {
			beatsPerMeasure,
			beatType,
		},
		quarterNoteDivisions,
		clef: 'bass',
	};
};

const getMeasuresJS = (part: Element) => {
	const measuresXML = getElements(part, 'measure');
	if (!measuresXML) return null;

	const measures: Measure[] = [];

	for (let i = 0; i < measuresXML.length; i++) {
		const measureXML = measuresXML[i];
		const measureAttributes = getMeasureAttributesJS(measureXML);
		if (!measureAttributes) return null;

		const notes = getMeasureNotesJS(
			measureXML,
			measureAttributes.quarterNoteDivisions
		);

		if (!notes) return null;
		measures.push({ notes });
	}

	return measures;
};

const getPartList = (root: XMLDocument) => {
	return root.getElementsByTagName('part-list');
};

export const musicXMLToJSON = (musicXML: XMLDocument) => {
	const tagName = musicXML.documentElement.tagName;
	if (tagName !== 'score-partwise') {
		console.error("can't read anything other than score-partwise rn");
		return null;
	}

	const partListXML = getPartList(musicXML);
	if (partListXML.length === 0) {
		console.error('no part list');
		return null;
	}

	const partsXML = musicXML.getElementsByTagName('part');
	if (!partsXML || !partsXML.length) return null;

	const partsJS: MusicPart[] = [];

	for (let i = 0; i < partsXML.length; i++) {
		const partXML = partsXML[i];
		const measures = getMeasuresJS(partXML);
		if (!measures) return null;

		partsJS.push({ instrument: 'bass guitar', id: 'p1', measures });
	}

	const musicScore: MusicScore = {
		title: 'need to extract title',
		parts: partsJS,
		pitchOctaveHelper: getPitchOctaveHelper('C4'), // get
		beatsPerMinute: 106, // get
		timeSignature: {
			// get
			beatNote: 4,
			beatsPerMeasure: 4,
		},
		keySignature: 'no', // get
	};

	return musicScore;
};
