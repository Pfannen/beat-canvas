import {
	NoteImportAnnotationsHelper,
	NoteImportAnnotationsHelperMap,
	NoteImportHelper,
	NoteImportHelperMap,
} from '@/types/import-export/import';
import { Accidental, Dynamic, Slur } from '@/types/music/note-annotations';
import {
	getSingleElement,
	validateElements,
	verifyTagName,
} from './xml-helpers';
import { Pitch } from '@/types/music';

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

const accidentalMarkImportHelper: NoteImportAnnotationsHelper = (a, el) => {
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

const articulationsImportHelper: NoteImportAnnotationsHelper = (a, el) => {
	if (!verifyTagName(el, 'articulations')) return;

	const { children } = el;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (child.tagName in notationsImportHelperMap) {
			notationsImportHelperMap[child.tagName](a, child);
		}
	}
};

const accentImportHelper: NoteImportAnnotationsHelper = (a, el) => {
	if (!verifyTagName(el, 'accent') && !verifyTagName(el, 'strong-accent'))
		return;
	a.accent = 'strong';
};

const softAccentImportHelper: NoteImportAnnotationsHelper = (a, el) => {
	if (!verifyTagName(el, 'soft-accent')) return;
	a.accent = 'weak';
};

const staccatoImportHelper: NoteImportAnnotationsHelper = (a, el) => {
	if (!verifyTagName(el, 'staccato')) return;

	a.staccato = true;
};

const dynamicsImportHelper: NoteImportAnnotationsHelper = (a, el) => {
	if (!verifyTagName(el, 'dynamics') || el.childElementCount === 0) return;

	a.dynamic = el.children[0].tagName as Dynamic;
};

const slurImportHelper: NoteImportAnnotationsHelper = (a, el) => {
	if (!verifyTagName(el, 'slur')) return;

	const type = el.getAttribute('type');
	if (!type) return;
	a.slur = type as Slur;
};

const tiedImportHelper: NoteImportAnnotationsHelper = (a, el) => {
	if (!verifyTagName(el, 'tied')) return;

	const type = el.getAttribute('type');
	if (!type) return;
	a.slur = type as Slur;
};

const notationsImportHelper: NoteImportHelper = (nD, el) => {
	if (el.tagName !== 'notations') {
		console.log('not notations');
		return;
	}

	const { children } = el;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (child.tagName in notationsImportHelperMap) {
			notationsImportHelperMap[child.tagName](nD.annotations, child);
		}
	}
};

export const noteImportHelperMap: NoteImportHelperMap = {
	pitch: pitchOctaveImportHelper,
	duration: durationImportHelper,
	notations: notationsImportHelper,
	accidental: accidentalImportHelper,
	chord: chordImportHelper,
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
