import { Measure } from '@/components/providers/music/types';
import {
	MeasureAttributes,
	RepeatEndings,
	StaticMeasureAttributes,
} from '@/types/music';
import {
	initializeMeasureAttributes,
	measureAttributeGenerator,
	updateMeasureAttributes,
} from './measure-generator';
import {
	CumulativeMeasureMapping,
	TrueMeasureMapping,
} from '@/types/music/expand-measures';
import { indexIsValid } from '@/utils';

type EndingState = {
	// Both indices are inclusive
	[key in number]: [number, number];
};

type TBCRepeatState = {
	commonMeasureEnd?: number;
	endings: EndingState;
};

type RepeatState = {
	forwardRepeatIndex: number;
	backwardRepeatIndex: number;
	repeatCount: number;
} & Required<TBCRepeatState>;

const applyRepeatState = (
	repeatState: RepeatState,
	measures: Measure[],
	expandedMeasures: Measure[]
) => {
	const {
		forwardRepeatIndex,
		commonMeasureEnd,
		endings,
		backwardRepeatIndex,
		repeatCount,
	} = repeatState;

	// Get the common measures to all repeat
	// Add 1 because commonMeasureEnd is supposed to be inclusive
	const commonMeasures = measures.slice(
		forwardRepeatIndex,
		commonMeasureEnd + 1
	);
	console.log(`Measures ${forwardRepeatIndex} - ${commonMeasureEnd} repeated`);
	for (let i = 1; i <= repeatCount + 1; i++) {
		expandedMeasures.push(...commonMeasures);
		if (i in endings) {
			const [start, stop] = endings[i];
			const endingMeasures = measures.slice(start, stop + 1);
			expandedMeasures.push(...endingMeasures);
			console.log(`Measures ${start} - ${stop} repeated as ending #${i}`);
		}
	}
};

const updateEndingsState = (
	endings: number[],
	repeatState: TBCRepeatState,
	measureIndex: number
) => {
	if (repeatState.commonMeasureEnd === undefined) {
		repeatState.commonMeasureEnd = measureIndex - 1;
	}

	const { endings: curEndingState } = repeatState;
	endings.forEach((ending) => {
		if (!curEndingState[ending])
			curEndingState[ending] = [measureIndex, measureIndex];
		else curEndingState[ending][1] = measureIndex;
	});
};

const forwardRepeatEncountered = (
	measures: Measure[],
	forwardRepeatIndex: number
) => {
	const tbcRepeatState: TBCRepeatState = {
		endings: {},
	};

	let i = 0;
	let repeatCount = 1;
	for (i = forwardRepeatIndex + 1; i < measures.length; i++) {
		const { staticAttributes } = measures[i];
		if (!staticAttributes) continue;

		const { repeatEndings, repeat } = staticAttributes;
		if (repeatEndings) {
			const { endings } = repeatEndings;
			updateEndingsState(endings, tbcRepeatState, i);
		}
		if (repeat && !repeat.forward) {
			repeatCount = repeat.repeatCount;
			break;
		}
	}

	if (tbcRepeatState.commonMeasureEnd === undefined) {
		tbcRepeatState.commonMeasureEnd = i;
	}

	const repeatState: RepeatState = {
		forwardRepeatIndex,
		commonMeasureEnd: tbcRepeatState.commonMeasureEnd,
		endings: tbcRepeatState.endings,
		backwardRepeatIndex: i,
		repeatCount,
	};
	return repeatState;

	// Return the index of the backward repeat encountered
	/* return i; */
};

const hasForwardRepeat = (
	staticAttributes?: Partial<StaticMeasureAttributes>
) => {
	return (
		staticAttributes &&
		staticAttributes.repeat &&
		staticAttributes.repeat.forward
	);
};

// cumulativeMeasureIdx: The next index of the expanded measures
// repeatState: Repeat information necessary to update the measure mapping
// updater: A function that should update some mapping reliant upon cumulative and true measure indices
const updateMeasureMapping = (
	cumulativeMeasureIdx: number,
	//measureMapping: CumulativeMeasureMapping,
	repeatState: RepeatState,
	updater: (cumulativeIdx: number, trueIdx: number) => void
) => {
	const {
		forwardRepeatIndex,
		commonMeasureEnd,
		endings,
		backwardRepeatIndex,
		repeatCount,
	} = repeatState;

	// 0 end, 0 start, 1 measure that's common
	const commonMeasureCount = commonMeasureEnd - forwardRepeatIndex + 1;

	// Add 1 to repeatCount because we always play the repeated measures at least once
	for (let i = 0; i < repeatCount + 1; i++) {
		// Go through all the common measures of a repeat
		for (let j = 0; j < commonMeasureCount; j++) {
			// measureNum gets incremented after each iteration, so mapping[j + measureNum] isn't needed
			// Add j to forwardRepeatIndex as those measures are common to all repeated measures
			// measureMapping[cumulativeMeasureIdx] = forwardRepeatIndex + j;
			updater(cumulativeMeasureIdx, forwardRepeatIndex + j);
			cumulativeMeasureIdx++;
		}

		// On the first (0th) pass through, we play the first ending, and so on
		if (i + 1 in endings) {
			const [start, end] = endings[i + 1];
			const endingMeasureCount = end - start + 1;
			for (let j = 0; j < endingMeasureCount; j++) {
				// Similar to adding j to forwardRepeatIndex, but endings start at the first value in the length-2 array
				// measureMapping[cumulativeMeasureIdx] = start + j;
				updater(cumulativeMeasureIdx, start + j);
				cumulativeMeasureIdx++;
			}
		}
	}

	return cumulativeMeasureIdx;
};

export const expandMeasures = (measures: Measure[]) => {
	if (!measures.length) return [];

	const expandedMeasures: Measure[] = [];
	for (let i = 0; i < measures.length; i++) {
		const measure = measures[i];
		if (hasForwardRepeat(measure.staticAttributes)) {
			/* i = forwardRepeatEncountered(measures, i, expandedMeasures); */
			const repeatState = forwardRepeatEncountered(measures, i);
			applyRepeatState(repeatState, measures, expandedMeasures);
			i = repeatState.backwardRepeatIndex;
		} else {
			expandedMeasures.push(measures[i]);
		}
	}

	return expandedMeasures;
};

// Updates a cumulative measure mapping
const cumulativeMeasureMappingUpdater = (
	mapping: CumulativeMeasureMapping,
	cumulativeIdx: number,
	trueIdx: number
) => {
	if (trueIdx < 0 || trueIdx > cumulativeIdx) {
		console.log(`True idx: ${trueIdx} | Cumulative idx: ${cumulativeIdx}`);
		return;
	}

	mapping[cumulativeIdx] = trueIdx;
};

export const getCumulativeMeasureMapping = (measures: Measure[]) => {
	let cumulativeMeasureIdx = 0;
	const cumulativeMeasureMapping: CumulativeMeasureMapping = {};
	const localUpdater = cumulativeMeasureMappingUpdater.bind(
		null,
		cumulativeMeasureMapping
	);

	for (let i = 0; i < measures.length; i++) {
		const measure = measures[i];
		if (hasForwardRepeat(measure.staticAttributes)) {
			const repeatState = forwardRepeatEncountered(measures, i);
			cumulativeMeasureIdx = updateMeasureMapping(
				cumulativeMeasureIdx,
				// measureMapping,
				repeatState,
				localUpdater
			);
			i = repeatState.backwardRepeatIndex;
		} else {
			cumulativeMeasureMapping[cumulativeMeasureIdx] = i;
			cumulativeMeasureIdx++;
		}
	}

	return cumulativeMeasureMapping;
};

// Updates a true measure mapping
const trueMeasureMappingUpdater = (
	trueArray: TrueMeasureMapping,
	cumulativeIdx: number,
	trueIdx: number
) => {
	if (!indexIsValid(trueIdx, trueArray.length)) {
		console.log(`Bad true idx: ${trueIdx} | Len: ${trueArray.length}`);
		return;
	}
	if (trueIdx < 0 || trueIdx > cumulativeIdx) {
		console.log(`True idx: ${trueIdx} | Cumulative idx: ${cumulativeIdx}`);
		return;
	}

	trueArray[trueIdx].push(cumulativeIdx);
};

export const getTrueMeasureMapping = (measures: Measure[]) => {
	let cumulativeMeasureIdx = 0;
	const trueMeasureMapping: TrueMeasureMapping = [];
	measures.forEach(() => trueMeasureMapping.push([]));
	const localUpdater = trueMeasureMappingUpdater.bind(null, trueMeasureMapping);

	for (let i = 0; i < measures.length; i++) {
		const measure = measures[i];
		if (hasForwardRepeat(measure.staticAttributes)) {
			const repeatState = forwardRepeatEncountered(measures, i);
			cumulativeMeasureIdx = updateMeasureMapping(
				cumulativeMeasureIdx,
				// measureMapping,
				repeatState,
				localUpdater
			);
			i = repeatState.backwardRepeatIndex;
		} else {
			trueMeasureMapping[i].push(cumulativeMeasureIdx);
			cumulativeMeasureIdx++;
		}
	}

	return trueMeasureMapping;
};
