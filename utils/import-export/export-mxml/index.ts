import { MusicPart, MusicScore } from '@/types/music';
import {
	appendElement,
	appendElements,
	createMusicXMLDocument,
	createXMLElement,
} from './utils';
import { noteAttributeGenerator } from '@/utils/music/measures/traversal';
import { noteEC, restsEC } from './note-helpers';
import { attributesEC } from './measure-helpers';

const createMeasureElement = (index: number) => {
	const el = createXMLElement('measure');
	el.setAttribute('number', index.toString());
	return el;
};

const createPartElement = (partId: string) => {
	const partElement = createXMLElement('part');
	partElement.setAttribute('id', partId);
	return partElement;
};

const partEC = (part: MusicPart) => {
	const partElement = createPartElement(part.attributes.id);

	let measureElement: Element | null = null;
	for (const locObj of noteAttributeGenerator(part.measures)) {
		const { measureStart, measureIndex, note, newAttributes } = locObj;

		if (measureStart) {
			if (measureElement) appendElement(partElement, measureElement);
			measureElement = createMeasureElement(measureIndex);
		}

		if (note) {
			const { lastNoteXEnd, curX, currentAttributes } = locObj;
			const { clef, timeSignature } = currentAttributes;

			// If rests need to be generated (might not always be the case)
			if (lastNoteXEnd !== curX) {
				appendElements(
					measureElement!,
					restsEC(lastNoteXEnd, curX, timeSignature)
				);
			}

			// Create the current note
			appendElement(
				measureElement!,
				noteEC(note, timeSignature.beatNote, clef)
			);
		}

		if (newAttributes) {
			appendElements(measureElement!, attributesEC(newAttributes));
		}
	}

	return partElement;
};

export const createMusicXMLScore = (score: MusicScore) => {
	const [root, scoreXML] = createMusicXMLDocument();

	for (const part of score.parts) {
		appendElement(scoreXML, partEC(part));
	}

	return root;
};
