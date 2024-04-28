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
import { applyDynamic, applyWedge } from './apply-measure-attributes';
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

	const baseSPB = getSecondsPerBeat(attributes.metronome.beatsPerMinute);
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
	} of noteAttributeGenerator(expandedMeasures)) {
		if (completedDurationAttributes) {
			const { wedge } = completedDurationAttributes;
			if (wedge) {
				applyWedge(
					instrument,
					transport,
					wedge,
					wedgeDynamicStore,
					decibelRange
				);
			}
		}

		if (newAttributes) {
			if (newAttributes.wedge?.start)
				wedgeDynamicStore.startDynamic = currentAttributes.dynamic;
		}

		if (note) {
			enqueueNote(
				note,
				currentAttributes,
				instrument,
				persistentAttr,
				measureStartX,
				baseSPB,
				transport
			);
		}
	}
};
