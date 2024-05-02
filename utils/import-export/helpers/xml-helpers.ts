import { NoteType } from '@/components/providers/music/types';
import { AccidentalMXML, NoteTypeMXML } from '@/types/import-export/import';
import { Accidental } from '@/types/music';

export const createAppend = (
	root: XMLDocument,
	parent: Element,
	childName: string
) => {
	const child = root.createElement(childName);
	parent.appendChild(child);
	return child;
};

export const validateElements = (
	elements: (Element | null)[],
	checkTextContent = false
) => {
	for (const element of elements) {
		if (!element) return false;
		if (checkTextContent && !element.textContent) return false;
	}

	return true;
};

export const getElements = (
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

export const getSingleElement = (
	parent: Element,
	query: string,
	textContentChek = false
) => {
	const element = parent.querySelector(query);
	if (!element || (textContentChek && !element.textContent)) return null;

	return element;
};

export const verifyTagName = (element: Element, expectedTagName: string) => {
	return element.tagName === expectedTagName;
};

const mxmlNoteTypeToBeatCanvasNoteType: { [key in NoteTypeMXML]: NoteType } = {
	whole: 'whole',
	half: 'half',
	quarter: 'quarter',
	eighth: 'eighth',
	'16th': 'sixteenth',
	'32nd': 'thirtysecond',
	'64th': 'sixtyfourth',
	'128th': 'sixtyfourth',
};

export const convertFromMXMLNoteType = (mxmlNoteType: NoteTypeMXML) => {
	const noteType = mxmlNoteTypeToBeatCanvasNoteType[mxmlNoteType];
	if (!noteType) {
		console.error('Unknown mxml note type: ' + mxmlNoteType);
		return 'quarter';
	}

	return noteType;
};

const beatCanvasNoteTypeToMXMLNoteType: { [key in NoteType]: NoteTypeMXML } = {
	whole: 'whole',
	half: 'half',
	quarter: 'quarter',
	eighth: 'eighth',
	sixteenth: '16th',
	thirtysecond: '32nd',
	sixtyfourth: '64th',
};

export const convertToMXMLNoteType = (noteType: NoteType) => {
	const mxmlNoteType = beatCanvasNoteTypeToMXMLNoteType[noteType];
	if (!mxmlNoteType) {
		console.error('Unknown beat canvas note type: ' + noteType);
		return 'quarter';
	}

	return mxmlNoteType;
};

export const convertFromMXMLAccidental = (
	mxmlAccidental: AccidentalMXML
): Accidental => {
	if (mxmlAccidental === 'flat') return 'b';
	else if (mxmlAccidental === 'sharp') return '#';
	else return 'n';
};

export const convertToMXMLAccidental = (
	accidental: Accidental
): AccidentalMXML => {
	if (accidental === 'b') return 'flat';
	else if (accidental === '#') return 'sharp';
	else return 'natural';
};
