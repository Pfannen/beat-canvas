import {
	HelperAttributesArg,
	MeasureAttributesImportHelper,
	MeasureAttributesImportHelperMap,
	MeasureImportHelper,
	MeasureImportHelperMap,
	RepeatDirectionMXML,
	WedgeTypeMXML,
} from '@/types/import-export/import';
import {
	Metronome,
	Pitch,
	Repeat,
	RepeatEndingType,
	RepeatEndings,
} from '@/types/music';
import {
	getSingleElement,
	validateElements,
	verifyTagName,
} from './xml-helpers';
import Helper from './ImportMusicXMLHelper';
import { durationToNoteType, getYPosFromNote } from '@/utils/music';
import { convertImportedDuration, musicXMLToClef } from '@/utils/musicXML';
import { Note } from '@/components/providers/music/types';
import { Dynamic } from '@/types/music/note-annotations';

// #region misc attributes

const noteImportHelper: MeasureImportHelper = (mD, el) => {
	if (!verifyTagName(el, 'note')) return;

	const { currentAttributes } = mD;
	const { beatNote, beatsPerMeasure } = currentAttributes.timeSignature;

	if (mD.curX >= beatsPerMeasure) return;

	// TODO: Make getNoteDetails a non-default export
	const { pitch, octave, duration, type, annotations } = Helper.getNoteDetails(
		el,
		mD.tbcValues.notes
	);
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
			//type: durationToNoteType(trueDuration, beatNote),
			type: type || durationToNoteType(duration, beatNote),
		};
		if (annotations && Object.keys(annotations).length > 0)
			note.annotations = annotations;

		// If the current note is a chord, its x position isn't mD.curX because the first note in the chord
		// already advanced mD.curX and a note marked as a chord doesn't advance the x position
		if (annotations.chord) {
			note.x = mD.curX - mD.prevNoteDur;
		}

		mD.notes.push(note);
	}

	// If the note is a chord, it doesn't advance the x position
	// That's done by the first note of the chord, which doesn't have the chord annotation
	if (!annotations.chord) {
		mD.curX += trueDuration;
		mD.prevNoteDur = trueDuration;
	}
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

	mD.newDynamicAttributes.metronome = metronome;
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

	mD.newDynamicAttributes.metronome = metronome;
};

/* const wedgeImportHelper: MeasureImportHelper = (mD, el) => {
	if (!verifyTagName(el, 'wedge') || !el.hasAttribute('type')) return;

	const { measures: tbc } = mD.tbcValues;
	const wedgeType = el.getAttribute('type');
	if (wedgeType === 'stop') {
		if (!('wedge' in tbc)) return;

		tbc.wedge!.measureEnd = mD.curMeasureNumber;
		tbc.wedge!.xEnd = mD.curX;
		delete tbc.wedge;
	} else {
		const wedge: Wedge = {
			crescendo: wedgeType === 'crescendo',
			measureEnd: mD.curMeasureNumber,
			xEnd: mD.curX,
		};

		tbc.wedge = wedge;
		mD.newDynamicAttributes.wedge = wedge;
	}
}; */

const wedgeImportHelper: MeasureImportHelper = (mD, el) => {
	if (!verifyTagName(el, 'wedge') || !el.hasAttribute('type')) return;

	const wedgeType = el.getAttribute('type') as WedgeTypeMXML;
	if (wedgeType === 'stop') {
		mD.newDynamicAttributes.wedge = { start: false };
	} else if (wedgeType !== 'continue') {
		mD.newDynamicAttributes.wedge = {
			start: true,
			crescendo: wedgeType === 'crescendo',
		};
	}
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
	/* console.log('Backup curX: ' + mD.curX);
	console.log('Backup notes parsed: ' + mD.notes.length); */
	mD.curX -= trueDuration;

	//mD.curX = mD.currentAttributes.timeSignature.beatsPerMeasure;
};

const dynamicsImportHelper: MeasureImportHelper = (mD, el) => {
	if (!verifyTagName(el, 'dynamics') || !el.children.length) return;

	const dynamic = el.children[0].tagName as Dynamic;
	mD.newDynamicAttributes.dynamic = dynamic;
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

/* const repeatImportHelper: MeasureImportHelper = (mD, el) => {
	if (!verifyTagName(el, 'repeat') || !el.hasAttribute('direction')) return;

	const forward = el.getAttribute('direction') === 'forward';
	const { measures: tbc } = mD.tbcValues;

	let repeat: Repeat;
	if (forward) {
		repeat = { forward };
		tbc.repeatMeasureNumber = mD.curMeasureNumber;
		// Found a forward repeat, measures up until a backward repeat can be an ending
		tbc.repeatEndings = {};
	} else {
		if (!('repeatMeasureNumber' in tbc)) return;

		let repeatCount = 1;
		if (el.hasAttribute('times')) repeatCount = +el.getAttribute('times')!;

		const jumpMeasure = tbc.repeatMeasureNumber!;
		repeat = {
			forward: false,
			jumpMeasure,
			repeatCount,
			remainingRepeats: repeatCount,
		};

		// Found a backward repeat, measures up until the next forward repeat can't be an ending
		if (tbc.repeatEndings) {
			if (Object.keys(tbc.repeatEndings).length === 0) {
				delete tbc.repeatEndings;
			}
		}
		delete tbc.repeatMeasureNumber;
	}

	mD.newStaticAttributes.repeat = repeat;
}; */

const repeatImportHelper: MeasureImportHelper = (mD, el) => {
	if (!verifyTagName(el, 'repeat') || !el.hasAttribute('direction')) return;

	const direction = el.getAttribute('direction') as RepeatDirectionMXML;
	if (direction === 'forward') {
		mD.newStaticAttributes.repeat = { forward: true };
	} else if (direction === 'backward') {
		// Make sure repeatCount is 1 or more
		let repeatCount = 1;
		const repeatCountStr = el.getAttribute('times');
		// If 'times' existed on the element
		if (repeatCountStr) {
			// Attempt to convert it to an integer
			repeatCount = parseInt(repeatCountStr);
			// Make sure repeatCount is at least 1
			repeatCount = Math.max(repeatCount, 1);
		}

		// Assign the new repeat to the current measure
		mD.newStaticAttributes.repeat = {
			forward: false,
			repeatCount: repeatCount,
		};
	}
};

/* // TODO: Address multiple numbers being in the 'number' attribute
const endingImportHelper: MeasureImportHelper = (mD, el) => {
	const { measures: tbc } = mD.tbcValues;
	// In the repeat import helper, we provide and remove a storage location for endings
	// depending on the type of repeat found
	// If tbcAttributes doesn't have the repeatEndings key, that means this ending element shouldn't be parsed
	if (
		!verifyTagName(el, 'ending') ||
		!el.hasAttribute('number') ||
		!el.hasAttribute('type') ||
		!tbc.repeatEndings
	)
		return;

	const endingNumber = +el.getAttribute('number')!;
	const type = el.getAttribute('type')! as RepeatEndingType;

	// TODO: After parsing multiple numbers from the number attribute, loop through them
	// and make repeatEndings[endingNumber] point to the created ending
	if (type === 'start') {
		const repeatEndings: RepeatEndings = {
			[endingNumber]: mD.curMeasureNumber,
		};
		tbc.repeatEndings[endingNumber] = repeatEndings;

		// (if we encounter an ending, we understand that as the whole measure being in that ending)
		mD.newStaticAttributes.repeatEndings = repeatEndings;
	} else if (type === 'stop' || type === 'discontinue') {
		// Check if endingNumber is present in repeatEndings
		// Then check if endingNumber is present in the repeatEndings that endingNumber was mapped to
		// RepeatEndings are modeled with an object because a measure can be apart of multiple endings
		if (
			!(endingNumber in tbc.repeatEndings) ||
			!(endingNumber in tbc.repeatEndings[endingNumber])
		)
			return;

		tbc.repeatEndings[endingNumber][endingNumber] = mD.curMeasureNumber;
		delete tbc.repeatEndings[endingNumber];
	}
}; */

const endingImportHelper: MeasureImportHelper = (mD, el) => {
	if (
		!verifyTagName(el, 'ending') ||
		!el.hasAttribute('number') ||
		!el.hasAttribute('type')
	)
		return;

	// Converts the comma-separated list of ending numbers into a number array
	const endings = el
		.getAttribute('number')!
		.split(',')
		.map((str) => parseInt(str));
	const type = el.getAttribute('type')! as RepeatEndingType;

	mD.newStaticAttributes.repeatEndings = {
		endings,
		type,
	};
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

	a.static.timeSignature = {
		beatNote: +beatTypeXML!.textContent!,
		beatsPerMeasure: +beatsXML!.textContent!,
	};
};

const clefImportHelper: MeasureAttributesImportHelper = (a, el) => {
	if (!verifyTagName(el, 'clef')) return;

	const signXML = getSingleElement(el, 'sign');
	const lineXML = getSingleElement(el, 'line');
	if (!validateElements([signXML, lineXML], true)) return null;

	a.static.clef = musicXMLToClef(
		signXML!.textContent! as Pitch,
		+lineXML!.textContent!
	);
};

const keySignatureImportHelper: MeasureAttributesImportHelper = (a, el) => {
	if (!verifyTagName(el, 'key')) return;

	const fifthsXML = getSingleElement(el, 'fifths', true);
	if (!fifthsXML) return;
	a.static.keySignature = +fifthsXML!.textContent!;
};

// #endregion

const attributesImportHelper: MeasureImportHelper = (mD, el) => {
	const attributes: HelperAttributesArg = {
		static: mD.newStaticAttributes,
		dynamic: mD.newDynamicAttributes,
	};

	const { children } = el;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (child.tagName in attributesImportHelperMap) {
			attributesImportHelperMap[child.tagName](attributes, child);
		}
	}

	if (attributes.quarterNoteDivisions)
		mD.currentAttributes.quarterNoteDivisions = attributes.quarterNoteDivisions;
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
	wedge: wedgeImportHelper,
	ending: endingImportHelper,
};

export const attributesImportHelperMap: MeasureAttributesImportHelperMap = {
	divisions: divisionsImportHelper,
	time: timeSignatureImportHelper,
	clef: clefImportHelper,
	key: keySignatureImportHelper,
};
