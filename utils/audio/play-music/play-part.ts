import { MusicPart } from '@/types/music';
import {
	getDefaultInstrumentAttributes,
	getInstrument,
	updateInstrument,
} from '../instruments';
import { ToneInstrument } from '@/types/audio/instrument';
import { InstrumentAttributes } from '@/types/music/note-annotations';
import { Transport } from 'tone/build/esm/core/clock/Transport';
import { getSecondsPerBeat } from '@/utils/music';
import { expandMeasures } from '@/utils/music/measures/expand-measures';
import { initializeMeasureAttributes } from '@/utils/music/measures/measure-generator';
import { enqueueNote } from './play-note';
import { getApplicationDecibelRange, getEnqueueDecibelRange } from '../volume';
import { noteAttributeGenerator } from '@/utils/music/measures/traversal';
import { Measure } from '@/components/providers/music/types';
import {
	AttributeApplyingInfo,
	applyDynamic,
	applyMeasureAttributes,
	applyWedge,
} from './apply-measure-attributes';
import { WedgeDynamicStore } from '@/types/audio/volume';
import { getDecibelsForDynamic } from './dynamics';

// TODO: Clean this method UP
export const enqueuePart = (
	part: MusicPart,
	instrument: ToneInstrument,
	transport: Transport,
	expandedMeasures?: Measure[]
) => {
	const { id, instrument: instrumentName, name } = part.attributes;
	console.log(`Enqueueing part ${name} with instrument ${instrumentName}`);

	const { measures } = part;
	const attributes = initializeMeasureAttributes(measures[0]);

	const persistentAttr: InstrumentAttributes = getDefaultInstrumentAttributes();
	updateInstrument(instrument, persistentAttr);

	let baseSPB = getSecondsPerBeat(attributes.metronome.beatsPerMinute);
	if (!expandedMeasures) expandedMeasures = expandMeasures(measures);

	const decibelRange = getEnqueueDecibelRange();
	const wedgeDynamicStore: WedgeDynamicStore = {
		startDynamic: attributes.dynamic,
	};

	instrument.volume.value = getDecibelsForDynamic(
		decibelRange,
		attributes.dynamic
	);

	for (const {
		currentAttributes,
		newAttributes,
		note,
		measureStartX,
		completedDurationAttributes,
		measureStart,
		curSeconds,
		curX,
	} of noteAttributeGenerator(expandedMeasures, undefined, true)) {
		// For now, only care about getting the new metronome at the beginning of a measure
		// Our current timing function does this
		// Also need to be careful with 'curSeconds' - this accounts for met changes mid measure that we don't factor in to the timing function yet
		if (curX === 0) {
			baseSPB = getSecondsPerBeat(currentAttributes.metronome.beatsPerMinute);
		}

		// NOTE: Can make this a lot better
		const attrApplyingInfo: AttributeApplyingInfo = {
			instrument,
			transport,
			curSeconds,
			decibelRange,
			newAttributes,
			completedWedge: completedDurationAttributes?.wedge && {
				durInfo: completedDurationAttributes.wedge,
				dynStore: wedgeDynamicStore,
			},
		};
		applyMeasureAttributes(attrApplyingInfo);

		if (note) {
			enqueueNote(
				note,
				currentAttributes,
				instrument,
				persistentAttr,
				curSeconds,
				baseSPB,
				transport
			);
		}
	}
};
