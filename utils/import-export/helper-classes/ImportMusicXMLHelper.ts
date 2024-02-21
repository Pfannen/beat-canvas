import { MeasureAttributesMXML, Metronome, Pitch } from '@/types/music';
import {
	getElements,
	getSingleElement,
	validateElements,
} from '../xml-helpers';
import { convertImportedDuration, musicXMLToClef } from '@/utils/musicXML';
import { TimeSignature } from '@/components/providers/music/types';

class ImportMusicXMLHelper {
	static getPartListXMLArray = (root: Element) =>
		getElements(root, 'part-list');

	static getPartsXMLArray = (root: Element) => getElements(root, 'part');

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
		else return stepXML!.textContent! + octaveXML!.textContent!;
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
			keySignature: 'not implemented yet',
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

		const attributes: MeasureAttributesMXML = {};

		const divisions = this.getMeasureDivisions(attributesXML);
		if (divisions !== null) attributes.quarterNoteDivisions = divisions;

		const timeSignature = this.getMeasureTimeSignature(attributesXML);
		if (timeSignature) attributes.timeSignature = timeSignature;

		const metronome = this.getMeasureMetronome(measureXML);
		if (metronome) attributes.metronome = metronome;

		const clef = this.getMeasureClef(attributesXML);
		if (clef) attributes.clef = clef;

		const key = this.getMeasureKeySignature(attributesXML);
		if (key) attributes.keySignature = key;

		return attributes;
	};
}

export default ImportMusicXMLHelper;
