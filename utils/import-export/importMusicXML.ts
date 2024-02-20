import {
	Measure,
	Note,
	NoteType,
	TimeSignature,
} from '@/components/providers/music/types';
import {
	Clef,
	MeasureAttributesMXML,
	Metronome,
	MusicPart,
	MusicScore,
	Pitch,
} from '@/types/music';
import { getYPosFromNote } from '../music';
import { musicXMLToClef } from '../musicXML';
import { getElements, getSingleElement, validateElements } from './xml-helpers';
import { getNoteDuration } from '@/components/providers/music/utils';

const getNotePitchOctave = (noteXML: Element) => {
	const pitchXML = getSingleElement(noteXML, 'pitch');
	if (!pitchXML) return null;

	const stepXML = getSingleElement(pitchXML, 'step');
	const octaveXML = getSingleElement(pitchXML, 'octave');
	if (!validateElements([stepXML, octaveXML], true)) return null;
	else return stepXML!.textContent! + octaveXML!.textContent!;
};

const getMeasureNotesJS = (
	measureXML: Element,
	quarterNoteDivisions: number,
	clef: Clef,
	timeSignature: TimeSignature
) => {
	const noteArr: Note[] = [];

	const noteXMLArr = getElements(measureXML, 'note');
	if (!noteXMLArr) return null;

	let curX = 0;
	const { beatNote, beatsPerMeasure } = timeSignature;
	for (let i = 0; i < noteXMLArr.length; i++) {
		const noteXML = noteXMLArr[i];

		const durationXML = getSingleElement(noteXML, 'duration', true);
		// TODO: Look into not being able to get duration element
		if (!durationXML) {
			continue;
		}

		// TODO: Make this a helper function
		const duration =
			beatNote / (4 / (+durationXML!.textContent! / quarterNoteDivisions));
		const pitchOctave = getNotePitchOctave(noteXML);
		if (pitchOctave) {
			// TODO: Implement a duration to note util and remove default quarter note type
			let type: NoteType = 'quarter';

			const typeXML = getSingleElement(noteXML, 'type', true);
			if (typeXML) {
				const tempType = typeXML!.textContent!;
				if (tempType === '16th') type = 'sixteenth';
				else if (tempType === '32nd') type = 'thirtysecond';
				else type = typeXML!.textContent! as NoteType;
				//console.log(type);
			} else {
				// Get type from duration
			}

			const y = getYPosFromNote(pitchOctave, clef);
			noteArr.push({ x: curX, y, type });
		} else {
			// TODO: Make no rest and no pitch result in beats per measure rest
			const restXML = getSingleElement(noteXML, 'rest');
			if (!restXML) {
				console.error('there was neither a pitch nor rest in a measure');
				//return null;
			}
		}

		curX += duration;
		// TODO: Address measures specifying multiple voices
		if (curX >= beatsPerMeasure) break;
	}

	return noteArr;
};

const getMeasureDivisions = (attributesXML: Element) => {
	const divisionsXML = getSingleElement(attributesXML, 'divisions', true);
	if (!divisionsXML) return null;
	else return +divisionsXML.textContent!;
};

const getMeasureTimeSignature = (attributesXML: Element) => {
	const timeXML = getSingleElement(attributesXML, 'time');
	if (!timeXML) return null;

	const beatsXML = getSingleElement(timeXML, 'beats');
	const beatTypeXML = getSingleElement(timeXML, 'beat-type');

	if (!validateElements([beatsXML, beatTypeXML], true)) return null;

	const timeSignature: TimeSignature = {
		beatNote: +beatTypeXML!.textContent!,
		beatsPerMeasure: +beatsXML!.textContent!,
	};
	return timeSignature;
};

const getMeasureMetronome = (measureXML: Element) => {
	let metronomeXML = getSingleElement(measureXML, 'metronome');
	console.log(metronomeXML);
	if (!metronomeXML) return null;

	const beatUnitXML = getSingleElement(metronomeXML, 'beat-unit');
	const perMinuteXML = getSingleElement(metronomeXML, 'per-minute');

	if (!validateElements([beatUnitXML, perMinuteXML], true)) return null;

	// TODO: Create utility to convert beatUnit (quarter, eighth, etc.) to number
	const metronome: Metronome = {
		beatNote: 4,
		beatsPerMinute: +perMinuteXML!.textContent!,
	};
	return metronome;
};

const getMeasureClef = (attributesXML: Element) => {
	const clefXML = getSingleElement(attributesXML, 'clef');
	if (!clefXML) return null;

	const signXML = getSingleElement(clefXML, 'sign');
	const lineXML = getSingleElement(clefXML, 'line');
	if (!validateElements([signXML, lineXML], true)) return null;

	const clef = musicXMLToClef(
		signXML!.textContent! as Pitch,
		+lineXML!.textContent!
	);
	return clef;
};

const getMeasureKeySignature = (attributesXML: Element) => {
	const keyXML = getSingleElement(attributesXML, 'key');
	if (!keyXML) return null;

	const fifthsXML = getSingleElement(keyXML, 'fifths', true);
	if (!fifthsXML) return null;
	else return fifthsXML!.textContent!;
};

const getMeasureAttributesJS = (measureXML: Element) => {
	const attributesXML = getSingleElement(measureXML, 'attributes');
	if (!attributesXML) return null;

	const attributes: MeasureAttributesMXML = {};

	const divisions = getMeasureDivisions(attributesXML);
	if (divisions !== null) attributes.quarterNoteDivisions = divisions;

	const timeSignature = getMeasureTimeSignature(attributesXML);
	if (timeSignature) attributes.timeSignature = timeSignature;

	const metronome = getMeasureMetronome(measureXML);
	if (metronome) attributes.metronome = metronome;

	const clef = getMeasureClef(attributesXML);
	if (clef) attributes.clef = clef;

	const key = getMeasureKeySignature(attributesXML);
	if (key) attributes.keySignature = key;

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
			// TODO: Remove any cast
			for (const key in measureAttributes) {
				curAttr[key as keyof MeasureAttributesMXML] = measureAttributes[
					key as keyof MeasureAttributesMXML
				] as any;
			}

			delete measureAttributes.quarterNoteDivisions;
			measure.attributes = measureAttributes;
		}

		const notes = getMeasureNotesJS(
			measureXML,
			curAttr.quarterNoteDivisions!,
			curAttr.clef!,
			curAttr.timeSignature!
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
