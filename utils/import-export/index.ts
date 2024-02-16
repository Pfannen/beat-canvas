'use client';

import { MusicScore, Pitch } from '@/types/music';
import {
	createAppend,
	createMeasureXML,
	createNoteXML,
	createPartListXML,
} from './xml-helpers';
import { getNoteFromYPos } from '../music-modifier';
import { getNoteDuration } from '@/components/providers/music/utils';

export const exportData = (
	content: string,
	contentType: string,
	fileName: string
) => {
	const tempAnchor = document.createElement('a');
	const file = new Blob([content], { type: contentType });

	tempAnchor.href = URL.createObjectURL(file);
	tempAnchor.download = fileName;
	tempAnchor.click();
};

// TODO: Extract each loop into its own method ; calculate rests between notes (getSegments) ; add title and instrument appropriately
export const musicXMLScore = (score: MusicScore) => {
	const { title, parts, pitchOctaveHelper, timeSignature } = score;

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

			const measureXML = createMeasureXML(root, j + 1, score.timeSignature);
			partXML.appendChild(measureXML);

			for (const { y, type } of notes) {
				const pitchOctave = getNoteFromYPos(y, pitchOctaveHelper);
				const pitch = pitchOctave.slice(0, -1) as Pitch;
				const octave = pitchOctave.slice(-1);
				const duration = getNoteDuration(type, timeSignature.beatNote);

				const noteXML = createNoteXML(root, pitch, octave, duration, type);
				measureXML.appendChild(noteXML);
			}
		}
	}

	return root;
};

export const exportMusicXMLScore = (score: MusicScore) => {
	const musicXML = musicXMLScore(score);
	const xmlString = new XMLSerializer().serializeToString(musicXML);
	exportData(xmlString, 'application/xml', score.title + '-MusicXML');
};

export const exportJSONScore = (score: MusicScore) => {
	const jsonString = JSON.stringify(score);
	exportData(jsonString, 'application/json', score.title + '-JSON');
};
