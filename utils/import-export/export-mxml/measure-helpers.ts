import { MeasureAttributes, MusicPart } from '@/types/music';
import { noteAttributeGenerator } from '@/utils/music/measures/traversal';
import {
	appendElement,
	appendElements,
	assignToParent,
	createDirectionTypeEl,
	createXMLElement,
} from './utils';
import { noteEC } from './note-helpers';
import {
	AttributePEC,
	AttributesPEAMap,
	AttributesParentStore,
	PropertyElementCreatorMap,
} from '@/types/import-export/export-mxml';
import { clefToMusicXML } from '@/utils/musicXML';
import { durationToNoteType } from '@/utils/music';

export const attributesEC = (measureAttributes: Partial<MeasureAttributes>) => {
	const parentStore: AttributesParentStore = {};

	// Loop through each attribute
	const entries = Object.entries(measureAttributes) as [
		[keyof MeasureAttributes, MeasureAttributes[keyof MeasureAttributes]]
	];

	for (const [key, value] of entries) {
		// If the key is in the attributes element creator map (should be)
		if (key in attributesECMap) {
			// Create the elements relating to the attribute
			const elements = attributesECMap[key](value as never);
			// If the key is in the attributes parent assigner map (should be)
			if (key in attributesPEAMap) {
				// Assign the attribute's elements to the right parent
				attributesPEAMap[key](parentStore, elements);
			}
		}
	}

	const { attributes, direction, barline } = parentStore;
	return [attributes, direction, barline];
};

const clefEC: AttributePEC<'clef'> = (clef) => {
	const clefEl = createXMLElement('clef');
	const signEl = createXMLElement('sign');
	const lineEl = createXMLElement('line');

	const mxmlClef = clefToMusicXML(clef);
	signEl.textContent = mxmlClef[0];
	lineEl.textContent = mxmlClef[1];
	appendElements(clefEl, [signEl, lineEl]);

	return [clefEl];
};

const dynamicEC: AttributePEC<'dynamic'> = (dynamic) => {
	const directionTypeEl = createDirectionTypeEl();
	const dynamicsEl = createXMLElement('dynamics');
	appendElement(dynamicsEl, createXMLElement(dynamic));
	appendElement(directionTypeEl, dynamicsEl);

	return [directionTypeEl];
};

const keySignatureEC: AttributePEC<'keySignature'> = (keySignature) => {
	const keyEl = createXMLElement('key');
	const fifthsEl = createXMLElement('fifths');
	fifthsEl.textContent = keySignature.toString();
	appendElement(keyEl, fifthsEl);

	return [keyEl];
};

const metronomeEC: AttributePEC<'metronome'> = (metronome) => {
	const directionTypeEl = createDirectionTypeEl();
	const metronomeEl = createXMLElement('metronome');
	const beatUnitEl = createXMLElement('beat-unit');
	const perMinuteEl = createXMLElement('per-minute');
	const soundEl = createXMLElement('sound');

	beatUnitEl.textContent = durationToNoteType(1, metronome.beatNote);
	perMinuteEl.textContent = metronome.beatsPerMinute.toString();
	soundEl.setAttribute('tempo', metronome.beatsPerMinute.toString());

	appendElements(metronomeEl, [beatUnitEl, perMinuteEl]);
	appendElement(directionTypeEl, metronomeEl);

	return [directionTypeEl, soundEl];
};

const repeatEC: AttributePEC<'repeat'> = (repeat) => {
	const repeatEl = createXMLElement('repeat');
	repeatEl.setAttribute('direction', repeat.forward ? 'forward' : 'backward');
	return [repeatEl];
};

const repeatEndingEC: AttributePEC<'repeatEndings'> = (repeatEndings) => {
	const { endings, type } = repeatEndings;
	const endingEl = createXMLElement('ending');
	endingEl.setAttribute('number', endings.join(','));
	endingEl.setAttribute('type', type);

	return [endingEl];
};

const timeSignatureEC: AttributePEC<'timeSignature'> = (timeSignature) => {
	const { beatsPerMeasure, beatNote } = timeSignature;

	const timeEl = createXMLElement('time');
	const beatsEl = createXMLElement('beats');
	const beatTypeEl = createXMLElement('beat-type');

	beatsEl.textContent = beatsPerMeasure.toString();
	beatTypeEl.textContent = beatNote.toString();

	appendElements(timeEl, [beatsEl, beatTypeEl]);

	return [timeEl];
};

const wedgeEC: AttributePEC<'wedge'> = (wedge) => {
	const directionTypeEl = createDirectionTypeEl();
	const wedgeEl = createXMLElement('wedge');

	if (wedge.start)
		wedgeEl.setAttribute('type', wedge.crescendo ? 'crescendo' : 'diminuendo');
	else wedgeEl.setAttribute('type', 'stop');

	appendElement(directionTypeEl, wedgeEl);

	return [directionTypeEl];
};

const attributesECMap: PropertyElementCreatorMap<Required<MeasureAttributes>> =
	{
		clef: clefEC,
		dynamic: dynamicEC,
		keySignature: keySignatureEC,
		metronome: metronomeEC,
		repeat: repeatEC,
		repeatEndings: repeatEndingEC,
		timeSignature: timeSignatureEC,
		wedge: wedgeEC,
	};

const assignToMeasureParent = assignToParent.bind(null, 'measure');
const assignToDirectionParent = assignToParent.bind(null, 'direction');
const assignToAttributesParent = assignToParent.bind(null, 'attributes');
const assignToBarLineParent = assignToParent.bind(null, 'barline');

const attributesPEAMap: AttributesPEAMap = {
	clef: assignToAttributesParent,
	dynamic: assignToDirectionParent,
	keySignature: assignToAttributesParent,
	metronome: assignToDirectionParent,
	repeat: assignToBarLineParent,
	repeatEndings: assignToBarLineParent,
	timeSignature: assignToAttributesParent,
	wedge: assignToDirectionParent,
};
