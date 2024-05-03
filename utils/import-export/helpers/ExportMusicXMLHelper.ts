import { clefToMusicXML } from '@/utils/musicXML';
import { createAppend } from './xml-helpers';
import {
	Clef,
	MeasureAttributes,
	Metronome,
	PartialMeasureAttributes,
} from '@/types/music';
import { Note, TimeSignature } from '@/components/providers/music/types';
import { minimalSegmentGenerator } from '@/utils/segments/segment-gen-1';
import { durationToNoteType } from '@/utils/music';

class ExportMusicXMLHelper {
	static createMusicXMLScorePartwise = (
		scoreTitle: string
	): [XMLDocument, Element] => {
		const header =
			'<?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE score-partwise><score-partwise></score-partwise>';
		const root = new DOMParser().parseFromString(header, 'application/xml');

		const scoreXML = root.querySelector('score-partwise')!;
		scoreXML.setAttribute('version', '4.0');

		const workXML = createAppend(root, scoreXML, 'work');
		const workTitleXML = createAppend(root, workXML, 'work-title');
		workTitleXML.textContent = scoreTitle;

		return [root, scoreXML];
	};

	static createTimeSignatureXML = (
		timeSignature: TimeSignature,
		root: XMLDocument,
		attributesXML: Element
	) => {
		const boundCA = createAppend.bind(this, root);

		const divisions = boundCA(attributesXML, 'divisions');
		divisions.textContent = (timeSignature.beatNote / 4).toString();
		const time = boundCA(attributesXML, 'time');
		const beats = boundCA(time, 'beats');
		beats.textContent = timeSignature.beatsPerMeasure.toString();
		const beatType = boundCA(time, 'beat-type');
		beatType.textContent = timeSignature.beatNote.toString();
	};

	static createKeySignatureXML = (
		keySignature: number,
		root: XMLDocument,
		attributesXML: Element
	) => {
		const boundCA = createAppend.bind(this, root);

		const key = boundCA(attributesXML, 'key');
		const fifths = boundCA(key, 'fifths');
		fifths.textContent = keySignature.toString();
	};

	static createMetronomeXML = (
		metronome: Metronome,
		root: XMLDocument,
		measureXML: Element
	) => {
		const boundCA = createAppend.bind(this, root);

		// MusicXML has metronome placed outside of attributes, but inside measure
		const directionTypeXML = boundCA(measureXML, 'direction-type');
		const metronomeXML = boundCA(directionTypeXML, 'metronome');
		const beatUnitXML = boundCA(metronomeXML, 'beat-unit');
		beatUnitXML.textContent = metronome.beatNote.toString();
		const perMinuteXML = boundCA(metronomeXML, 'per-minute');
		perMinuteXML.textContent = metronome.beatsPerMinute.toString();
	};

	static createClefXML = (
		clef: Clef,
		root: XMLDocument,
		attributesXML: Element
	) => {
		const boundCA = createAppend.bind(this, root);

		const musicXMLClef = clefToMusicXML(clef);
		const clefXML = boundCA(attributesXML, 'clef');
		const sign = boundCA(clefXML, 'sign');
		sign.textContent = musicXMLClef[0];
		const line = boundCA(clefXML, 'line');
		line.textContent = musicXMLClef[1];
	};

	static createMeasureAttributesXML = (
		root: XMLDocument,
		measureXML: Element,
		curAttributes: MeasureAttributes,
		attributes?: PartialMeasureAttributes
	) => {
		if (!attributes) return null;

		const attributesXML = createAppend(root, measureXML, 'attributes');

		const { timeSignature, keySignature, metronome, clef } = attributes;

		if (timeSignature) {
			curAttributes.timeSignature = timeSignature;
			this.createTimeSignatureXML(timeSignature, root, attributesXML);
		}

		if (keySignature !== undefined) {
			curAttributes.keySignature = keySignature;
			this.createKeySignatureXML(keySignature, root, attributesXML);
		}

		if (metronome) {
			curAttributes.metronome = metronome;
			this.createMetronomeXML(metronome, root, measureXML);
		}

		if (clef) {
			curAttributes.clef = clef;
			this.createClefXML(clef, root, attributesXML);
		}

		return attributesXML;
	};

	static createRestsXML = (
		root: XMLDocument,
		measureXML: Element,
		xPos1: number,
		xPos2: number,
		timeSignature: TimeSignature
	) => {
		const { beatNote, beatsPerMeasure } = timeSignature;
		if (xPos2 > beatsPerMeasure) xPos2 = beatsPerMeasure;
		const restsData = minimalSegmentGenerator(xPos1, xPos2);

		const boundCA = createAppend.bind(this, root);
		restsData.forEach(({ count, segmentBeat }) => {
			const noteXML = boundCA(measureXML, 'note');
			boundCA(noteXML, 'rest');

			const duration = count * segmentBeat;
			const durationXML = boundCA(noteXML, 'duration');
			durationXML.textContent = duration.toString();

			const typeXML = boundCA(noteXML, 'type');
			typeXML.textContent = durationToNoteType(duration, beatNote);
		});
	};
}

export default ExportMusicXMLHelper;
