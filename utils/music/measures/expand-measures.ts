import { Measure } from '@/components/providers/music/types';
import { MeasureAttributes, RepeatEndings } from '@/types/music';
import {
	initializeMeasureAttributes,
	measureAttributeGenerator,
	updateMeasureAttributes,
} from './measure-generator';

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
	forwardRepeatIndex: number,
	expandedMeasures: Measure[]
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
	applyRepeatState(repeatState, measures, expandedMeasures);

	// Return the index of the backward repeat encountered
	return i;
};

export const expandMeasures = (measures: Measure[]) => {
	if (!measures.length) return [];

	const expandedMeasures: Measure[] = [];
	for (let i = 0; i < measures.length; i++) {
		const measure = measures[i];
		const { staticAttributes: sA, temporalAttributes: tA } = measure;
		if (sA && sA.repeat && sA.repeat.forward) {
			i = forwardRepeatEncountered(measures, i, expandedMeasures);
		} else {
			expandedMeasures.push(measures[i]);
		}
	}

	return expandedMeasures;
};
