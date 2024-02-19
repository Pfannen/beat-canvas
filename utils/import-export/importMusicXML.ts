import { Measure, Note, NoteType } from '@/components/providers/music/types';
import {
	MeasureAttributesMXML,
	MusicPart,
	MusicScore,
	Pitch,
	PitchOctaveHelper,
} from '@/types/music';
import {
	getPitchOctaveHelper,
	getPitchOctaveHelperForClef,
	getYPosFromNote,
} from '../music';
import { musicXMLToClef } from '../musicXML';

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
	quarterNoteDivisions: number,
	pitchOctaveHelper: PitchOctaveHelper
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
			// TODO: Implement a duration to note util and remove default quarter note type
			let type: NoteType = 'quarter';
			if (typeXMLArr && typeXMLArr[0].textContent)
				type = typeXMLArr[0].textContent as NoteType;

			const y = getYPosFromNote(pitchOctave, pitchOctaveHelper);
			noteArr.push({ x: curX, y, type });
		} else {
			// TODO: Make no rest and no pitch result beats per measure rest
			const restXMLArr = getElements(noteXML, 'rest', false);
			if (!restXMLArr) {
				console.error('there was neither a pitch nor rest in a measure');
				//return null;
			}
		}

		curX += duration;
	}

	return noteArr;
};

const getMeasureAttributesJS = (measureXML: Element) => {
	const attributesXMLArr = getElements(measureXML, 'attributes', false);
	if (!attributesXMLArr) return null;

	const attributes: MeasureAttributesMXML = {};
	const attributesXML = attributesXMLArr[0];

	const divisionsXMLArr = getElements(attributesXML, 'divisions', false);
	if (divisionsXMLArr && divisionsXMLArr[0].textContent)
		attributes.quarterNoteDivisions = +divisionsXMLArr[0].textContent;

	const timeXMLArr = getElements(attributesXML, 'time', false);
	if (timeXMLArr) {
		const timeXML = timeXMLArr[0];
		const beatsXMLArr = getElements(timeXML, 'beats');
		const beatTypeXMLArr = getElements(timeXML, 'beat-type');

		if (
			beatsXMLArr &&
			beatsXMLArr[0].textContent &&
			beatTypeXMLArr &&
			beatTypeXMLArr[0].textContent
		) {
			attributes.timeSignature = {
				beatNote: +beatTypeXMLArr[0].textContent,
				beatsPerMeasure: +beatsXMLArr[0].textContent,
			};
		}
	}

	const metronomeXMLArr = getElements(attributesXML, 'metronome', false);
	if (metronomeXMLArr) {
		const metronomeXML = metronomeXMLArr[0];
		const beatUnitXMLArr = getElements(metronomeXML, 'beat-unit', false);
		const perMinuteXMLArr = getElements(metronomeXML, 'per-minute', false);

		if (
			beatUnitXMLArr &&
			beatUnitXMLArr[0].textContent &&
			perMinuteXMLArr &&
			perMinuteXMLArr[0].textContent
		) {
			attributes.metronome = {
				beatNote: +beatUnitXMLArr[0].textContent,
				beatsPerMinute: +perMinuteXMLArr[0].textContent,
			};
		}
	}

	const clefXMLArr = getElements(attributesXML, 'clef', false);
	if (clefXMLArr) {
		const clefXML = clefXMLArr[0];
		const signXMLArr = getElements(clefXML, 'sign');
		const lineXMLArr = getElements(clefXML, 'line');

		if (
			signXMLArr &&
			signXMLArr[0].textContent &&
			lineXMLArr &&
			lineXMLArr[0].textContent
		) {
			attributes.clef = musicXMLToClef(
				signXMLArr[0].textContent as Pitch,
				+lineXMLArr[0].textContent
			);
		}
	}

	const keyXMLArr = getElements(attributesXML, 'key', false);
	if (keyXMLArr) {
		const keyXML = keyXMLArr[0];
		const fifthsXMLArr = getElements(keyXML, 'fifths');

		if (fifthsXMLArr && fifthsXMLArr[0].textContent) {
			attributes.keySignature = fifthsXMLArr[0].textContent;
		}
	}

	return attributes;
};

const getMeasuresJS = (part: Element) => {
	const measuresXML = getElements(part, 'measure');
	if (!measuresXML) return null;

	const measures: Measure[] = [];
	const curAttr: MeasureAttributesMXML = {
		metronome: {
			beatNote: 4,
			beatsPerMinute: 60,
		},
		timeSignature: {
			beatNote: 4,
			beatsPerMeasure: 4,
		},
		keySignature: 'not implemented yet',
		clef: 'treble',
		quarterNoteDivisions: 1,
	};

	for (let i = 0; i < measuresXML.length; i++) {
		const measureXML = measuresXML[i];
		const measure: Measure = {
			notes: [],
		};

		const measureAttributes = getMeasureAttributesJS(measureXML);
		if (measureAttributes) {
			// TODO: Make squiggles go away, types are correct
			for (const key in measureAttributes) {
				curAttr[key] = measureAttributes[key];
			}

			delete measureAttributes.quarterNoteDivisions;
			measure.attributes = measureAttributes;
		}

		const notes = getMeasureNotesJS(
			measureXML,
			curAttr.quarterNoteDivisions!,
			getPitchOctaveHelperForClef(curAttr.clef!)
		);

		if (!notes) return null;
		measure.notes = notes;
		measures.push(measure);
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
	};

	return musicScore;
};
