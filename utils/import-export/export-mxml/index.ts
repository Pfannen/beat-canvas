import { MusicPart, MusicScore } from '@/types/music';
import {
	appendElement,
	createMusicXMLDocument,
	createXMLElement,
} from './utils';
import { noteAttributeGenerator } from '@/utils/music/measures/traversal';
import { noteEC } from './note-helpers';

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
		if (locObj.measureStart) {
			if (measureElement) appendElement(partElement, measureElement);
			measureElement = createMeasureElement(locObj.measureIndex);
		}

		if (locObj.note) {
			const {
				timeSignature: { beatNote },
				clef,
			} = locObj.currentAttributes;
			appendElement(measureElement!, noteEC(locObj.note, beatNote, clef));
		}

        if (locObj.newAttributes) {
            
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
