import {
	MeasureAttributesImportHelper,
	MeasureAttributesImportHelperMap,
	MeasureImportHelper,
	MeasureImportHelperMap,
} from '@/types/import-export/import';
import { MeasureAttributesMXML, Metronome, Pitch, Repeat } from '@/types/music';
import {
	getSingleElement,
	validateElements,
	verifyTagName,
} from './xml-helpers';
import Helper from './ImportMusicXMLHelper';
import { durationToNoteType, getYPosFromNote } from '@/utils/music';
import { convertImportedDuration, musicXMLToClef } from '@/utils/musicXML';
import { Note } from '@/components/providers/music/types';
import { assignTemporalMeasureAttributes } from '@/utils/music/measure-attributes';
import { Dynamic } from '@/types/music/note-annotations';

// #region misc attributes

const noteImportHelper: MeasureImportHelper = (mD, el) => {
	if (!verifyTagName(el, 'note')) return;

	const { currentAttributes } = mD;
	const { beatNote, beatsPerMeasure } = currentAttributes.timeSignature;

	if (mD.curX >= beatsPerMeasure) return;

	// TODO: Make getNoteDetails a non-default export
	const { pitch, octave, duration, annotations } = Helper.getNoteDetails(el);
	if (!duration) return;

	const trueDuration = convertImportedDuration(
		currentAttributes.quarterNoteDivisions,
		duration,
		beatNote
	);

	if (pitch && octave !== undefined) {
		const note: Note = {
			x: mD.curX,
			y: getYPosFromNote({ pitch, octave }, currentAttributes.clef),
			type: durationToNoteType(trueDuration, beatNote),
		};
		if (annotations && Object.keys(annotations).length > 0)
			note.annotations = annotations;
		mD.notes.push(note);
	}

	mD.curX += trueDuration;
};

const metronomeImportHelper: MeasureImportHelper = (mD, el) => {
	if (!verifyTagName(el, 'metronome')) return;

	const beatUnitXML = getSingleElement(el, 'beat-unit');
	const perMinuteXML = getSingleElement(el, 'per-minute');

	if (!validateElements([beatUnitXML, perMinuteXML], true)) return null;

	// TODO: Create utility to convert beatUnit (quarter, eighth, etc.) to number
	const metronome: Metronome = {
		beatNote: 4,
		beatsPerMinute: +perMinuteXML!.textContent!,
	};
	mD.currentAttributes.metronome = metronome;

	assignTemporalMeasureAttributes(
		mD.newTemporalAttributes,
		{ metronome },
		mD.curX
	);
};

const directionImportHelper: MeasureImportHelper = (mD, el) => {
	if (!verifyTagName(el, 'direction')) return;

	const { children } = el;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (child.tagName in measureImportHelperMap) {
			measureImportHelperMap[child.tagName](mD, child);
		}
	}
};

const directionTypeImportHelper: MeasureImportHelper = (mD, el) => {
	if (!verifyTagName(el, 'direction-type')) return;

	const { children } = el;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (child.tagName in measureImportHelperMap) {
			measureImportHelperMap[child.tagName](mD, child);
		}
	}
};

const soundImportHelper: MeasureImportHelper = (mD, el) => {
	if (!verifyTagName(el, 'sound')) return;

	const tempoAttr = el.getAttribute('tempo');
	if (!tempoAttr) return;

	const tempo = +tempoAttr;
	if (isNaN(tempo) || tempo <= 0) return;

	const metronome: Metronome = {
		beatNote: 4,
		beatsPerMinute: tempo,
	};

	mD.currentAttributes.metronome = metronome;

	assignTemporalMeasureAttributes(
		mD.newTemporalAttributes,
		{ metronome },
		mD.curX
	);
};

const backupImportHelper: MeasureImportHelper = (mD, el) => {
	if (
		!verifyTagName(el, 'backup') ||
		(!el.children.length && el.children[0].tagName !== 'duration')
	)
		return;

	// TODO: Once we have the ability to edit chords / stacked notes, we can work with backup and forward elements and uncomment this
	const duration = +el.children[0].textContent!;
	const trueDuration = convertImportedDuration(
		mD.currentAttributes.quarterNoteDivisions,
		duration,
		mD.currentAttributes.timeSignature.beatNote
	);
	mD.curX -= trueDuration;

	//mD.curX = mD.currentAttributes.timeSignature.beatsPerMeasure;
};

const dynamicsImportHelper: MeasureImportHelper = (mD, el) => {
	if (!verifyTagName(el, 'dynamics') || !el.children.length) return;

	const dynamic = el.children[0].tagName as Dynamic;
	mD.currentAttributes.dynamic = dynamic;
	assignTemporalMeasureAttributes(
		mD.newTemporalAttributes,
		{ dynamic },
		mD.curX
	);
};

const barlineImportHelper: MeasureImportHelper = (mD, el) => {
	if (!verifyTagName(el, 'barline') || !el.children.length) return;

	const { children } = el;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (child.tagName in measureImportHelperMap) {
			measureImportHelperMap[child.tagName](mD, child);
		}
	}
};

const repeatImportHelper: MeasureImportHelper = (mD, el) => {
	if (!verifyTagName(el, 'repeat') || !el.getAttribute('direction')) return;

	const forward = el.getAttribute('direction') === 'forward';
	const repeat: Repeat = { forward };
	if (forward) {
		mD.tbcAttributes.repeatMeasureNumber = mD.curMeasureNumber;
	} else {
		if (!('repeatMeasureNumber' in mD.tbcAttributes)) return;
		repeat.jumpMeasure = mD.tbcAttributes.repeatMeasureNumber;
		delete mD.tbcAttributes.repeatMeasureNumber;
	}

	assignTemporalMeasureAttributes(
		mD.newTemporalAttributes,
		{ repeat },
		mD.curX
	);
};

// #endregion

// -----------------------------------------------------------------------------

// #region attributes children

const divisionsImportHelper: MeasureAttributesImportHelper = (
	a,
	el: Element
) => {
	if (!verifyTagName(el, 'divisions')) return;

	a.quarterNoteDivisions = +el.textContent!;
};

const timeSignatureImportHelper: MeasureAttributesImportHelper = (a, el) => {
	if (!verifyTagName(el, 'time')) return;

	const beatsXML = getSingleElement(el, 'beats');
	const beatTypeXML = getSingleElement(el, 'beat-type');

	if (!validateElements([beatsXML, beatTypeXML], true)) return null;

	a.timeSignature = {
		beatNote: +beatTypeXML!.textContent!,
		beatsPerMeasure: +beatsXML!.textContent!,
	};
};

const clefImportHelper: MeasureAttributesImportHelper = (a, el) => {
	if (!verifyTagName(el, 'clef')) return;

	const signXML = getSingleElement(el, 'sign');
	const lineXML = getSingleElement(el, 'line');
	if (!validateElements([signXML, lineXML], true)) return null;

	a.clef = musicXMLToClef(
		signXML!.textContent! as Pitch,
		+lineXML!.textContent!
	);
};

const keySignatureImportHelper: MeasureAttributesImportHelper = (a, el) => {
	if (!verifyTagName(el, 'key')) return;

	const fifthsXML = getSingleElement(el, 'fifths', true);
	if (!fifthsXML) return;
	a.keySignature = +fifthsXML!.textContent!;
};

// #endregion

const attributesImportHelper: MeasureImportHelper = (mD, el) => {
	const newAttributes: Partial<MeasureAttributesMXML> = {};

	const { children } = el;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (child.tagName in attributesImportHelperMap) {
			attributesImportHelperMap[child.tagName](newAttributes, child);
		}
	}

	Object.assign(mD.currentAttributes, newAttributes);
	delete newAttributes.quarterNoteDivisions;

	assignTemporalMeasureAttributes(
		mD.newTemporalAttributes,
		newAttributes,
		mD.curX
	);
};

// TODO: Extract direction-specifc helpers into their own map
export const measureImportHelperMap: MeasureImportHelperMap = {
	attributes: attributesImportHelper,
	note: noteImportHelper,
	metronome: metronomeImportHelper,
	direction: directionImportHelper,
	'direction-type': directionTypeImportHelper,
	sound: soundImportHelper,
	backup: backupImportHelper,
	dynamics: dynamicsImportHelper,
	barline: barlineImportHelper,
	repeat: repeatImportHelper,
};

export const attributesImportHelperMap: MeasureAttributesImportHelperMap = {
	divisions: divisionsImportHelper,
	time: timeSignatureImportHelper,
	clef: clefImportHelper,
	key: keySignatureImportHelper,
};
