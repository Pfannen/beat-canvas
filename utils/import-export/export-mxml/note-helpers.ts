import { Note, TimeSignature } from '@/components/providers/music/types';
import { getNoteDuration } from '@/components/providers/music/utils';
import {
	AnnotationPEA,
	AnnotationPEC,
	AnnotationsPEAMap,
	AnnotationsParentStore,
	PropertyElementCreatorMap,
} from '@/types/import-export/export-mxml';
import { Clef } from '@/types/music';
import { NoteAnnotations } from '@/types/music/note-annotations';
import { durationToNoteType, getNoteFromYPos } from '@/utils/music';
import {
	appendElement,
	appendElements,
	assignToParent,
	createXMLElement,
} from './utils';
import { minimalSegmentGenerator } from '@/utils/segments/segment-gen-1';
import { convertToMXMLNoteType } from '../helpers/xml-helpers';

const pitchEC = (note: Note, clef: Clef) => {
	const pitchEl = createXMLElement('pitch');
	const stepEl = createXMLElement('step');
	const octaveEl = createXMLElement('octave');

	const { pitch, octave } = getNoteFromYPos(note.y, clef);
	stepEl.textContent = pitch;
	octaveEl.textContent = octave.toString();

	appendElements(pitchEl, [stepEl, octaveEl]);

	return pitchEl;
};

// Note element creator
export const noteEC = (note: Note, beatNote: number, clef: Clef) => {
	const noteEl = createXMLElement('note');

	const pitchEl = pitchEC(note, clef);

	const durationEl = createXMLElement('duration');
	durationEl.textContent = getNoteDuration(
		note.type,
		beatNote,
		note.annotations?.dotted
	).toString();

	const typeEl = createXMLElement('type');
	typeEl.textContent = convertToMXMLNoteType(note.type);

	noteEl.appendChild(pitchEl);
	noteEl.appendChild(durationEl);
	noteEl.appendChild(typeEl);

	const parentStore: AnnotationsParentStore = { note: noteEl };

	// If there are note annotations
	if (note.annotations) {
		const { annotations } = note;

		// Loop through each annotation
		const entries = Object.entries(annotations) as [
			[keyof NoteAnnotations, NoteAnnotations[keyof NoteAnnotations]]
		];

		for (const [key, value] of entries) {
			// If the key is in the annotations element creator map (should be)
			if (key in annotationsECMap) {
				// Create the elements relating to the annotation
				const elements = annotationsECMap[key](value as never);
				// If the key is in the annotations parent assigner map (should be)
				if (key in annotationsPEAMap) {
					// Assign the annotation's elements to the right parent
					annotationsPEAMap[key](parentStore, elements);
				}
			}
		}
	}

	// If we have an articulations element but no notations element
	if (parentStore.articulations && !parentStore.notations) {
		// Create a notations element because it's needed
		parentStore.notations = createXMLElement('notations');
	}

	// If we have a notations element
	if (parentStore.notations) {
		// Append the articulations element to it, if it exists
		if (parentStore.articulations)
			parentStore.notations.appendChild(parentStore.articulations);
		// Append the notations alement to the note element
		noteEl.appendChild(parentStore.notations);
	}

	// Return the created note element
	return noteEl;
};

const accentPEC: AnnotationPEC<'accent'> = (accent) => {
	return [createXMLElement('accent')];
};

const accidentalPEC: AnnotationPEC<'accidental'> = (accidental) => {
	const accidentalEl = createXMLElement('accidental');
	accidentalEl.textContent = accidental;
	return [accidentalEl];
};

const chordPEC: AnnotationPEC<'chord'> = (chord) => {
	if (chord) return [createXMLElement('chord')];
	else return [];
};

const dottedPEC: AnnotationPEC<'dotted'> = (dotted) => {
	if (dotted) return [createXMLElement('dot')];
	else return [];
};

const slurPEC: AnnotationPEC<'slur'> = (slur) => {
	const slurEls: Element[] = [];

	if (slur.stop) {
		slur.stop.forEach((val) => {
			const slurEl = createXMLElement('slur');
			slurEl.setAttribute('type', 'stop');
			slurEls.push(slurEl);
		});
	}

	if (slur.start) {
		const slurEl = createXMLElement('slur');
		slurEl.setAttribute('type', 'start');
		slurEls.push(slurEl);
	}

	return slurEls;
};

const staccatoPEC: AnnotationPEC<'staccato'> = (staccato) => {
	if (staccato) return [createXMLElement('staccato')];
	else return [];
};

const annotationsECMap: PropertyElementCreatorMap<Required<NoteAnnotations>> = {
	accent: accentPEC,
	accidental: accidentalPEC,
	chord: chordPEC,
	dotted: dottedPEC,
	dynamic: (a) => [],
	slur: slurPEC,
	staccato: staccatoPEC,
};

const assignToNoteParent: AnnotationPEA = assignToParent.bind(null, 'note');

const assignToNotationsParent: AnnotationPEA = assignToParent.bind(
	null,
	'notations'
);

const assignToArticulationsParent: AnnotationPEA = assignToParent.bind(
	null,
	'articulations'
);

const annotationsPEAMap: AnnotationsPEAMap = {
	dotted: assignToNoteParent,
	accent: assignToArticulationsParent,
	accidental: assignToNotationsParent,
	chord: assignToNoteParent,
	dynamic: assignToNotationsParent,
	slur: assignToNotationsParent,
	staccato: assignToArticulationsParent,
};

export const restsEC = (
	lastNoteX: number,
	curX: number,
	timeSignature: TimeSignature
) => {
	const { beatNote, beatsPerMeasure } = timeSignature;
	if (curX > beatsPerMeasure || curX <= lastNoteX || lastNoteX < 0) return [];
	const restsData = minimalSegmentGenerator(lastNoteX, curX);

	const restEls: Element[] = [];

	restsData.forEach(({ count, segmentBeat }) => {
		const noteEl = createXMLElement('note');
		const restEl = createXMLElement('rest');
		const durationEl = createXMLElement('duration');
		const typeEl = createXMLElement('type');

		durationEl.textContent = segmentBeat.toString();
		typeEl.textContent = convertToMXMLNoteType(
			durationToNoteType(segmentBeat, beatNote)
		);

		appendElements(noteEl, [restEl, durationEl, typeEl]);
		restEls.push(noteEl);
		for (let i = 0; i < count; i++) {
			restEls.push(noteEl.cloneNode() as Element);
		}
	});

	return restEls;

	/* return restsData.map(({ count, segmentBeat }) => {
		const noteEl = createXMLElement('note');
		const restEl = createXMLElement('rest');
		const durationEl = createXMLElement('duration');
		const typeEl = createXMLElement('type');

		//const duration = count * segmentBeat;
		durationEl.textContent = segmentBeat.toString();
		typeEl.textContent = durationToNoteType(segmentBeat, beatNote);

		appendElements(noteEl, [restEl, durationEl, typeEl]);
		return noteEl;
	}); */
};
