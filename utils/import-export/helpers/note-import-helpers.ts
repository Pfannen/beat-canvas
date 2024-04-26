import {
	NoteImportAnnotationsHelper,
	NoteImportAnnotationsHelperMap,
	NoteImportHelper,
	NoteImportHelperMap,
	NoteTypeMXML,
} from '@/types/import-export/import';
import {
	Accidental,
	Dynamic,
	Slur,
	SlurMXMLImport,
} from '@/types/music/note-annotations';
import {
	convertFromMXMLNoteType,
	getSingleElement,
	validateElements,
	verifyTagName,
} from './xml-helpers';
import { Pitch } from '@/types/music';
import { NoteType } from '@/components/providers/music/types';

const pitchOctaveImportHelper: NoteImportHelper = (nD, el) => {
	if (!verifyTagName(el, 'pitch')) return;
	const stepXML = getSingleElement(el, 'step');
	const octaveXML = getSingleElement(el, 'octave');
	if (!validateElements([stepXML, octaveXML], true)) return;

	nD.pitch = stepXML!.textContent! as Pitch;
	nD.octave = +octaveXML!.textContent!;
};

const durationImportHelper: NoteImportHelper = (nD, el) => {
	if (!verifyTagName(el, 'duration') || !el.textContent) {
		console.log('not duration');
		return;
	}

	nD.duration = +el.textContent;
};

const accidentalMarkImportHelper: NoteImportAnnotationsHelper = (
	details,
	el
) => {
	const { a } = details;
	if (!verifyTagName(el, 'accidental-mark') || !el.textContent) return;
	a.accidental = el.textContent as Accidental;
};

const accidentalImportHelper: NoteImportHelper = (nD, el) => {
	if (!verifyTagName(el, 'accidental') || !el.textContent) return;
	nD.annotations.accidental = el.textContent as Accidental;
};

const chordImportHelper: NoteImportHelper = (nD, el) => {
	if (!verifyTagName(el, 'chord')) return;
	nD.annotations.chord = true;
};

const typeImportHelper: NoteImportHelper = (nD, el) => {
	if (!verifyTagName(el, 'type') || !el.textContent) return;
	nD.type = convertFromMXMLNoteType(el.textContent as NoteTypeMXML) as NoteType;
};

const articulationsImportHelper: NoteImportAnnotationsHelper = (
	details,
	el
) => {
	if (!verifyTagName(el, 'articulations')) return;

	const { children } = el;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (child.tagName in notationsImportHelperMap) {
			notationsImportHelperMap[child.tagName](details, child);
		}
	}
};

const accentImportHelper: NoteImportAnnotationsHelper = (details, el) => {
	if (!verifyTagName(el, 'accent') && !verifyTagName(el, 'strong-accent'))
		return;
	const { a } = details;
	a.accent = 'strong';
};

const softAccentImportHelper: NoteImportAnnotationsHelper = (details, el) => {
	if (!verifyTagName(el, 'soft-accent')) return;
	const { a } = details;
	a.accent = 'weak';
};

const staccatoImportHelper: NoteImportAnnotationsHelper = (details, el) => {
	if (!verifyTagName(el, 'staccato')) return;
	const { a } = details;
	a.staccato = true;
};

const dotImportHelper: NoteImportHelper = (nD, el) => {
	if (!verifyTagName(el, 'dot')) return;

	nD.annotations.dotted = true;
};

const dynamicsImportHelper: NoteImportAnnotationsHelper = (details, el) => {
	if (!verifyTagName(el, 'dynamics') || el.childElementCount === 0) return;
	const { a } = details;
	a.dynamic = el.children[0].tagName as Dynamic;
};

const slurImportHelper: NoteImportAnnotationsHelper = (details, el) => {
	if (!verifyTagName(el, 'slur') && !verifyTagName(el, 'tied')) return;

	const type = el.getAttribute('type') as SlurMXMLImport | undefined;
	if (!type) return;

	const { a, tbc } = details;
	// If this is the start of the slur
	if (type === 'start') {
		// If the slur array doesn't exist, create it
		if (!tbc.slurIds) tbc.slurIds = [];

		// Generate the slur id w/ math random and add it to the stack
		const slurId = Math.random();
		tbc.slurIds.push(slurId);
		// Set the current note to have a slur annotation
		a.slur = {
			start: slurId,
		};
	}
	// Else if this is the end of the slur and there is a slur waiting to be completed
	else if (tbc.slurIds) {
		// Grab the slur id if there's one in the stack
		const slurId = tbc.slurIds.pop();
		if (slurId === undefined) return;

		// Make the current note have a slur if it doesn't have one already
		if (!a.slur) a.slur = { stop: [] };
		if (!a.slur.stop) a.slur.stop = [];
		// Push the slur id
		a.slur.stop.push(slurId);
	}
};

const tiedImportHelper: NoteImportAnnotationsHelper = (details, el) => {
	slurImportHelper(details, el);
};

const notationsImportHelper: NoteImportHelper = (nD, el) => {
	if (el.tagName !== 'notations') {
		console.log('not notations');
		return;
	}

	const { children } = el;
	const details = { a: nD.annotations, tbc: nD.tbcAnnotations };
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (child.tagName in notationsImportHelperMap) {
			notationsImportHelperMap[child.tagName](details, child);
		}
	}
};

export const noteImportHelperMap: NoteImportHelperMap = {
	pitch: pitchOctaveImportHelper,
	duration: durationImportHelper,
	notations: notationsImportHelper,
	accidental: accidentalImportHelper,
	chord: chordImportHelper,
	type: typeImportHelper,
	dot: dotImportHelper,
};

export const notationsImportHelperMap: NoteImportAnnotationsHelperMap = {
	articulations: articulationsImportHelper,
	accent: accentImportHelper,
	'strong-accent': accentImportHelper,
	'soft-accent': softAccentImportHelper,
	'accidental-mark': accidentalMarkImportHelper,
	dynamics: dynamicsImportHelper,
	slur: slurImportHelper,
	tied: tiedImportHelper,
	staccato: staccatoImportHelper,
};
