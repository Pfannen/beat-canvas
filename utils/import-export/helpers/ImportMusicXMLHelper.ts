import {
	MeasureAttributesMXML,
	Metronome,
	MusicPartAttributes,
	Pitch,
	PitchOctave,
} from '@/types/music';
import { getElements, getSingleElement, validateElements } from './xml-helpers';
import { convertImportedDuration, musicXMLToClef } from '@/utils/musicXML';
import { Measure, TimeSignature } from '@/components/providers/music/types';
import {
	MeasureImportDetails,
	NoteImportDetails,
} from '@/types/import-export/import';
import { noteImportHelperMap } from './note-import-helpers';
import { measureImportHelperMap } from './measure-import-helpers';

class ImportMusicXMLHelper {
	static getScoreTitle = (root: Element) => {
		const workTitleXML = getSingleElement(root, 'work work-title', true);
		if (workTitleXML) return workTitleXML!.textContent!;
	};

	static getPartsXMLArray = (root: Element) => getElements(root, 'part');

	static getPartAttributesArray = (root: Element) => {
		const partListXML = getSingleElement(root, 'part-list');
		if (!partListXML) return null;

		const scorePartsXMLArr = getElements(partListXML, 'score-part');
		if (!scorePartsXMLArr) return null;

		const partAttributesArr: MusicPartAttributes[] = [];
		for (let i = 0; i < scorePartsXMLArr.length; i++) {
			const scorePartXML = scorePartsXMLArr[i];

			let id = scorePartXML.getAttribute('id');
			if (!id) id = `P${i}`;

			let name = `Part ${i}`;
			const partNameXML = getSingleElement(scorePartXML, 'part-name', true);
			if (partNameXML) name = partNameXML!.textContent!;

			let instrument = `Instrument ${i}`;
			const instrumentNameXML = getSingleElement(
				scorePartXML,
				'score-instrument instrument-name',
				true
			);
			if (instrumentNameXML) instrument = instrumentNameXML!.textContent!;

			partAttributesArr.push({ instrument, id, name });
		}

		return partAttributesArr;
	};

	static getMeasureXMLArray = (partXML: Element) =>
		getElements(partXML, 'measure');

	static getNoteXMLArray = (measureXML: Element) =>
		getElements(measureXML, 'note');

	static getNoteXMLPitchOctave = (noteXML: Element) => {
		const pitchXML = getSingleElement(noteXML, 'pitch');
		if (!pitchXML) return null;

		const stepXML = getSingleElement(pitchXML, 'step');
		const octaveXML = getSingleElement(pitchXML, 'octave');
		if (!validateElements([stepXML, octaveXML], true)) return null;
		else
			return {
				pitch: stepXML!.textContent!,
				octave: +octaveXML!.textContent!,
			} as PitchOctave;
	};

	static getNoteXMLDuration = (
		noteXML: Element,
		quarterNoteDivisions: number,
		beatNote: number
	) => {
		const durationXML = getSingleElement(noteXML, 'duration', true);
		// TODO: Look into not being able to get duration element
		if (!durationXML) return null;

		return convertImportedDuration(
			quarterNoteDivisions,
			+durationXML!.textContent!,
			beatNote
		);
	};

	static noteXMLIsRest = (noteXML: Element) =>
		!!getSingleElement(noteXML, 'rest');

	static noteXMLIsGraceNote = (noteXML: Element) =>
		!!getSingleElement(noteXML, 'grace');

	static getDefaultMeasureAttributes = () => {
		return {
			metronome: {
				beatNote: 4,
				beatsPerMinute: 60,
			},
			timeSignature: {
				beatNote: 4,
				beatsPerMeasure: 4,
			},
			keySignature: 0,
			clef: 'treble',
			quarterNoteDivisions: 1,
		} as MeasureAttributesMXML;
	};

	static getMeasureDivisions = (attributesXML: Element) => {
		const divisionsXML = getSingleElement(attributesXML, 'divisions', true);
		if (!divisionsXML) return null;
		else return +divisionsXML.textContent!;
	};

	static getMeasureTimeSignature = (attributesXML: Element) => {
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

	static getMeasureMetronome = (measureXML: Element) => {
		let metronomeXML = getSingleElement(measureXML, 'metronome');
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

	static getMeasureClef = (attributesXML: Element) => {
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

	static getMeasureKeySignature = (attributesXML: Element) => {
		const keyXML = getSingleElement(attributesXML, 'key');
		if (!keyXML) return null;

		const fifthsXML = getSingleElement(keyXML, 'fifths', true);
		if (!fifthsXML) return null;
		else return fifthsXML!.textContent!;
	};

	static getMeasureAttributesJS = (measureXML: Element) => {
		const attributesXML = getSingleElement(measureXML, 'attributes');
		if (!attributesXML) return null;

		const attributes: Partial<MeasureAttributesMXML> = {};

		const divisions = this.getMeasureDivisions(attributesXML);
		if (divisions !== null) attributes.quarterNoteDivisions = divisions;

		const timeSignature = this.getMeasureTimeSignature(attributesXML);
		if (timeSignature) attributes.timeSignature = timeSignature;

		const metronome = this.getMeasureMetronome(measureXML);
		if (metronome) attributes.metronome = metronome;

		const clef = this.getMeasureClef(attributesXML);
		if (clef) attributes.clef = clef;

		const key = this.getMeasureKeySignature(attributesXML);
		if (key) attributes.keySignature = +key;

		return attributes;
	};

	static getNoteDetails = (noteXML: Element) => {
		const noteDetails: NoteImportDetails = {};
		const { children } = noteXML;

		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (child.tagName in noteImportHelperMap) {
				noteImportHelperMap[child.tagName](noteDetails, child);
			}
		}

		return noteDetails;
	};

	static getMeasureDetails = (
		measureXML: Element,
		measureAttributes: MeasureAttributesMXML
	) => {
		const measureDetails: MeasureImportDetails = {
			currentAttributes: measureAttributes,
			newTemporalAttributes: [],
			notes: [],
			curX: 0,
		};

		const { children } = measureXML;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (child.tagName in measureImportHelperMap) {
				measureImportHelperMap[child.tagName](measureDetails, child);
			}

			// TODO: Having equal-to can screw up backup elements, look into this
			if (
				measureDetails.curX >
				measureDetails.currentAttributes.timeSignature.beatsPerMeasure
			)
				break;
		}

		return measureDetails;
	};
}

export default ImportMusicXMLHelper;
