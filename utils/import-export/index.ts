'use client';

import { MusicScore } from '@/types/music';
import { createMusicXMLScore } from './exportMusicXML';
import { musicXMLToJSON } from './importMusicXML';

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

export const exportMusicXMLScore = (score: MusicScore) => {
	const musicXML = createMusicXMLScore(score);
	const xmlString = new XMLSerializer().serializeToString(musicXML);
	exportData(xmlString, 'application/xml', score.title + '-MusicXML');
};

export const exportJSONScore = (score: MusicScore) => {
	const jsonString = JSON.stringify(score);
	exportData(jsonString, 'application/json', score.title + '-JSON');
};

export const importMusicXMLScore = (
	file: File,
	xmlLoadCallback: (score: MusicScore | null) => void
) => {
	if (file.type !== 'text/xml' && file.type !== 'application/xml') {
		xmlLoadCallback(null);
		return;
	}

	const fileReader = new FileReader();
	fileReader.onload = (event) => {
		if (!event.target) {
			xmlLoadCallback(null);
			return;
		}

		const xmlString = event.target.result as string;
		const parser = new DOMParser();
		try {
			const xml = parser.parseFromString(xmlString, 'application/xml');
			const musicScore = musicXMLToJSON(xml);
			if (!musicScore) xmlLoadCallback(null);
			else xmlLoadCallback(musicScore);
		} catch {
			xmlLoadCallback(null);
		}
	};

	fileReader.readAsText(file);
};
