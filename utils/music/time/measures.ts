import { Measure, TimeSignature } from '@/components/providers/music/types';
import {
	initializeMeasureAttributes,
	iterateAndUpdateTemporal,
	updateMeasureAttributes,
} from '../measures/measure-generator';
import { MeasureAttributes, Metronome } from '@/types/music';
import { getQuarterNoteDuration } from '..';
import { getQuarterNotesPerMeasure, getSecondsPerQuarterNote } from '.';

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

export type MeasureDurationOptionParams = {
	durationStartIndex?: number;
	durationEndIndex?: number;
	measureZeroAttributes?: MeasureAttributes;
};
export const getMeasuresStartAndEndTime = (
	measures: Measure[],
	options: MeasureDurationOptionParams
): [number, number] => {
	// Extract options as let variables so we can easily update them if they're not provided
	let { durationStartIndex, durationEndIndex, measureZeroAttributes } = options;

	// Set optional parameters if they're not present
	const attributes =
		measureZeroAttributes || initializeMeasureAttributes(measures[0]);
	if (durationStartIndex === undefined) durationStartIndex = 0;
	if (durationEndIndex === undefined) durationEndIndex = measures.length;

	// If the indices are bad, return
	if (
		durationStartIndex >= measures.length ||
		durationEndIndex >= measures.length
	)
		return [0, 0];

	// Store the start and end durations as a 2-element array
	let durations = [0, 0] as [number, number];
	// Store the current time in seconds
	let curTime = 0;
	// Go through all measures up to and including the end measure
	for (let i = 0; i <= durationEndIndex; i++) {
		// If the current measure is the start measure, log the time
		if (i === durationStartIndex) durations[0] = curTime;

		const { staticAttributes, temporalAttributes } = measures[i];
		// Update the static attributes - required for possible new time signature
		updateMeasureAttributes(attributes, staticAttributes);

		// Calculate the amount of time spent in the current measure
		curTime += getTimeInMeasure(attributes.metronome, attributes.timeSignature);

		// Go through the temporal attributes - required for possible new metronome
		// (will need to change later to address metronome change mid-measure)
		iterateAndUpdateTemporal(attributes, temporalAttributes);
	}

	// After the loop, the current time represents the end time of the end measure
	durations[1] = curTime;
	return durations;
};
