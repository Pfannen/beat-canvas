import { Measure, TimeSignature } from '@/components/providers/music/types';
import {
	initializeMeasureAttributes,
	iterateAndUpdateTemporal,
	updateMeasureAttributes,
} from '../measures/measure-generator';
import { MeasureAttributes, Metronome } from '@/types/music';
import { getQuarterNoteDuration } from '..';
import { getQuarterNotesPerMeasure, getSecondsPerQuarterNote } from '.';
import { indexIsValid } from '@/utils';
import { IndexEndTime } from '@/types/music/expand-measures';
import {
	expandMeasures,
	getCumulativeMeasureMapping,
	getTrueMeasureMapping,
} from '../measures/expand-measures';

// Returns the amount of time spent in a measure
const getTimeInMeasure = (
	metronome: Metronome,
	timeSignature: TimeSignature
) => {
	const quarterNotesPerMeasure = getQuarterNotesPerMeasure(timeSignature);
	const secondsPerQuarterNote = getSecondsPerQuarterNote(metronome);

	// (quarter notes / measure) * (seconds / quarter note) -> seconds / measure
	return quarterNotesPerMeasure * secondsPerQuarterNote;
};

export const getMeasureSecondsArray = (
	measures: Measure[],
	measureZeroAttributes?: MeasureAttributes
) => {
	if (!measures || !measures.length) return [0];

	// Set optional parameters if they're not present
	const attributes =
		measureZeroAttributes || initializeMeasureAttributes(measures[0]);

	const times: number[] = [0];
	// Store the current time in seconds
	let curTime = 0;
	// Go through all measures up to and including the end measure
	for (let i = 0; i < measures.length; i++) {
		const { staticAttributes, temporalAttributes } = measures[i];
		// Update the static attributes - required for possible new time signature
		updateMeasureAttributes(attributes, staticAttributes);
		// Update the temporal attributes - required for possible new metronome
		updateMeasureAttributes(
			attributes,
			temporalAttributes?.length ? temporalAttributes[0].attributes : undefined
		);

		// Calculate the amount of time spent in the current measure
		curTime += getTimeInMeasure(attributes.metronome, attributes.timeSignature);
		times.push(curTime);

		// Go through the temporal attributes - required for possible new metronome
		// (will need to change later to address metronome change mid-measure)
		iterateAndUpdateTemporal(attributes, temporalAttributes);
	}

	return times;
};

export type MeasureDurationOptionParams = {
	durationStartIndex?: number;
	durationEndIndex?: number;
	measureZeroAttributes?: MeasureAttributes;
};

// The durationStartIndex is the measureIdx you want the start time of
// The durationEndIndex is the measureIdx you want the end time of
// They can equal one another if you want the start and end time of the same measure (to loop a single measure, for example)
export const getMeasuresStartAndEndTime = (
	measures: Measure[],
	options: MeasureDurationOptionParams = {},
	measuresNeedExpansion = false
): [number, number] => {
	// Extract options as let variables so we can easily update them if they're not provided
	let { durationStartIndex, durationEndIndex, measureZeroAttributes } = options;

	// Set optional parameters if they're not present
	const attributes =
		measureZeroAttributes || initializeMeasureAttributes(measures[0]);
	if (durationStartIndex === undefined) durationStartIndex = 0;
	if (durationEndIndex === undefined) durationEndIndex = measures.length - 1;

	if (
		!indexIsValid(durationStartIndex, measures.length) ||
		!indexIsValid(durationEndIndex, measures.length) ||
		durationStartIndex > durationEndIndex
	)
		// If the indices are bad, return
		return [0, 0];

	// If measures need expanding, the given indices are true indices, not cumulative
	if (measuresNeedExpansion) {
		// Get an array mapping from true idx to cumulative indices
		// For looping, repeats can get in the way and thus true indices won't map to their seconds correctly
		// Because of this, we use their last occurrence in the score
		const mapping = getTrueMeasureMapping(measures);
		const startMapLen = mapping[durationStartIndex].length;
		const endMapLen = mapping[durationEndIndex].length;
		durationStartIndex = mapping[durationStartIndex][startMapLen - 1];
		durationEndIndex = mapping[durationEndIndex][endMapLen - 1];

		measures = expandMeasures(measures);
	}

	// Store the start and end times of the target indices
	// Add 1 to the end index because the end time of it is the start time of the next index
	// It's guaranteed the returned array will have the length of the measures + 1
	const measureSeconds = getMeasureSecondsArray(measures, attributes);
	const durations: [number, number] = [
		measureSeconds[durationStartIndex],
		measureSeconds[durationEndIndex + 1],
	];

	return durations;
};

// Returns an array in increasing order of end time that stores
// an end time to the true measure index it belongs to
export const getIndexEndTimes = (
	nonExpandedMeasures: Measure[],
	measureZeroAttributes?: MeasureAttributes
) => {
	const expandedMeasures = expandMeasures(nonExpandedMeasures);
	// Get the array of seconds
	const measureSeconds = getMeasureSecondsArray(
		expandedMeasures,
		measureZeroAttributes
	);
	// Get the mapping of cummulative measure idx to true measure idx
	const measureMapping = getCumulativeMeasureMapping(nonExpandedMeasures);

	const indexToEndTimes: IndexEndTime[] = [];
	let cummulativeMeasureIdx = 0;
	while (cummulativeMeasureIdx in measureMapping) {
		const trueMeasureIdx = measureMapping[cummulativeMeasureIdx];
		const measureEndTime = measureSeconds[cummulativeMeasureIdx + 1];
		indexToEndTimes.push({ index: trueMeasureIdx, seconds: measureEndTime });
		cummulativeMeasureIdx++;
	}

	return indexToEndTimes;
};
