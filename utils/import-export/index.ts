'use client';

import { MusicScore } from '@/types/music';
import { createMusicXMLScore } from './exportMusicXML';
import { musicXMLToJSON } from './importMusicXML';
import { loadFile } from '..';
import { FileScoreRetriever } from '@/types/import-export';
import { validateMusicScore } from '../schemas/validators';
import { ToneAudioBuffer, ToneAudioBuffers } from 'tone';
// @ts-ignore
import * as audioBufferToBlob from 'audiobuffer-to-blob';
import { toneBufferToAudioBuffer } from './audio-buffer-utils';

export const exportData = (
	content: string,
	contentType: string,
	fileName: string
) => {
	const file = new Blob([content], { type: contentType });

	exportBlob(file, fileName);
};

export const exportBlob = (blob: Blob, fileName: string) => {
	const tempAnchor = document.createElement('a');
	tempAnchor.href = URL.createObjectURL(blob);
	tempAnchor.download = fileName;
	tempAnchor.click();
};

export const exportMusicXMLScore = (score: MusicScore) => {
	const musicXML = createMusicXMLScore(score);
	const xmlString = new XMLSerializer().serializeToString(musicXML);
	exportData(xmlString, 'application/xml', score.title + '-MusicXML');
};

export const exportJSONScore = (score: MusicScore) => {
	const jsonString = JSON.stringify(score);
	exportData(jsonString, 'application/json', score.title + '-JSON');
};

// TODO: Allow musicxml files so we can bring back the IF check
export const importMusicXMLScore: FileScoreRetriever = async (file) => {
	/* if (file.type !== 'text/xml' && file.type !== 'application/xml') {
		return null;
	} */

	const xmlString = await loadFile(file, 'text');
	if (!xmlString || typeof xmlString !== 'string') return null;

	const parser = new DOMParser();
	try {
		const xml = parser.parseFromString(xmlString, 'application/xml');
		const musicScore = musicXMLToJSON(xml);
		if (!musicScore) return null;
		else return musicScore;
	} catch {
		return null;
	}
};

export const importJSONScore: FileScoreRetriever = async (file) => {
	if (file.type !== 'text/json' && file.type !== 'application/json') {
		return null;
	}

	const jsonString = await loadFile(file, 'text');
	if (!jsonString || typeof jsonString !== 'string') return null;

	try {
		const json = JSON.parse(jsonString);
		const isMusicScore = validateMusicScore(json);
		if (isMusicScore) return json as MusicScore;
		else return null;
	} catch {
		console.log('There was an error processing the json file...');
		return null;
	}
};

export const exportAudioBuffer = (buffer: AudioBuffer, fileName = '') => {
	const blob = audioBufferToBlob(buffer) as Blob;
	exportBlob(new Blob([blob], { type: 'audio/mp3' }), fileName);
};
