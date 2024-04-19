import { Measure } from '@/components/providers/music/types';
import { MeasureAttributes, RepeatEndings } from '@/types/music';

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
	const expandedMeasures: Measure[] = [];
	for (let i = 0; i < measures.length; i++) {
		const { staticAttributes: sA } = measures[i];
		if (sA && sA.repeat && sA.repeat.forward) {
			i = forwardRepeatEncountered(measures, i, expandedMeasures);
		} else {
			expandedMeasures.push(measures[i]);
		}
	}

	return expandedMeasures;
};

/* type RepeatState = {
	forward: [number, number];
	endings: {
		[ending in number]: [number, number];
	};
	repeatCount: number;
};

const applyRepeat = (
	measures: Measure[],
	expandedMeasures: Measure[],
	repeatState: RepeatState
) => {
	if (repeatState.repeatCount === -1) return;
	const { forward, endings, repeatCount } = repeatState;
	for (let i = 1; i <= repeatCount; i++) {
		console.log(`Measures ${forward[0]} - ${forward[1] - 1} repeated`);
		expandedMeasures.push(...measures.slice(forward[0], forward[1]));
		if (i + 1 in endings) {
			const [beg, end] = endings[i];
			expandedMeasures.push(...measures.slice(beg, end + 1));
		}
	}
}; */

/* export const expandMeasures = (measures: Measure[]) => {
	// If we encounter an ending -> set end always
	// If we encounter a backward repeat -> set end if not set and expand measures

	const expandedMeasures: Measure[] = [];
	let repeatState: RepeatState | undefined;

	for (let i = 0; i < measures.length; i++) {
		const measure = measures[i];
		expandedMeasures.push(measure);

		const { staticAttributes } = measure;
		if (staticAttributes) {
			const { repeat, repeatEndings } = staticAttributes;

			if (repeat) {
				if (repeat.forward)
					repeatState = {
						forward: [i, i],
						repeatCount: -1,
						endings: {},
					};
				else if (repeatState) {
					repeatState.repeatCount = repeat.repeatCount;
				}
			}

			if (repeatEndings && repeatState) {
				for (const endingNumber in repeatEndings) {
					repeatState.endings[endingNumber] = [i, repeatEndings[endingNumber]];
				}
			}
		}

		if (repeatState) {
			if (!Object.keys(repeatState.endings).length) repeatState.forward[1]++;

			if (repeatState.repeatCount > 0) {
				applyRepeat(measures, expandedMeasures, repeatState);
				repeatState = undefined;
			}
		}
	}

	return expandedMeasures;
}; */
