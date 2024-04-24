import { MusicPart } from '@/types/music';
import {
	getDefaultInstrumentProps,
	getInstrument,
	updateInstrument,
} from '../instruments';
import { ToneInstrument } from '@/types/audio/instrument';
import { PersistentInstrumentAttributes } from '@/types/music/note-annotations';
import { Transport } from 'tone/build/esm/core/clock/Transport';
import { getSecondsPerBeat } from '@/utils/music';
import { expandMeasures } from '@/utils/music/measures/expand-measures';
import { initializeMeasureAttributes } from '@/utils/music/measures/measure-generator';
import { enqueueNote } from './play-note';
import { dynamicToVelocity } from '../volume';
import { noteAttributeGenerator } from '@/utils/music/measures/traversal';
import { Measure } from '@/components/providers/music/types';

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

	const persistentAttr: PersistentInstrumentAttributes = {
		instrumentProps: getDefaultInstrumentProps(),
		velocity: 0.5,
	};
	updateInstrument(instrument, persistentAttr.instrumentProps);

	const baseSPB = getSecondsPerBeat(attributes.metronome.beatsPerMinute);
	if (!expandedMeasures) expandedMeasures = expandMeasures(measures);

	for (const {
		currentAttributes,
		newAttributes,
		note,
		measureStartX,
	} of noteAttributeGenerator(expandedMeasures)) {
		persistentAttr.velocity = dynamicToVelocity(currentAttributes.dynamic);

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
