import { useState } from 'react';
import { Measure } from '../../types';
import { MeasureFetcher, MeasureModifier } from './utils';
import { MusicPartAttributes, MusicScore } from '@/types/music';

const useMeasures = (initialMeasures?: Measure[]) => {
	const [measures, setMeasures] = useState<Measure[]>(initialMeasures || []);
	const [musicScore, setMusicScore] = useState<MusicScore>();

	const invokeMeasureModifier = (del: ReturnType<MeasureModifier<any>>) => {
		setMeasures((prevState) => {
			const copyState = [...prevState];
			const getMeasures: MeasureFetcher = (index, count) => {
				if (index === undefined || !count) {
					return copyState;
				}
				const copiedMeasures = [];
				for (let i = 0; i < count; i++) {
					const copyMeasure = {
						notes: [...copyState[i + index].notes],
					};
					copyState[i + index] = copyMeasure;
					copiedMeasures.push(copyMeasure);
				}
				return copiedMeasures;
			};

			if (del(getMeasures) === false) return prevState; //Delegate could not perform the requested modification so no state is needed to be updated
			return copyState;
		});
	};

	const replaceMeasures = (measures: Measure[]) => {
		setMeasures(measures);
	};

	const getMeasures = (index: number, count: number) => {
		return measures.slice(index, index + count);
	};

	const getPartAttributes = () => {
		const parts: MusicPartAttributes[] = [];

		if (!musicScore) return parts;
		musicScore.parts.forEach((part) => parts.push(part.attributes));

		return parts;
	};

	const setNewMusicScore = (score: MusicScore) => {
		setMusicScore(score);
	};

	return {
		measures,
		musicScore,
		replaceMeasures,
		invokeMeasureModifier,
		getMeasures,
		getPartAttributes,
		setNewMusicScore,
	};
};

useMeasures.initialState = {
	measures: [],
	musicScore: { title: 'n/a', parts: [] },
	invokeMeasureModifier: () => {},
	getMeasures: () => [],
	replaceMeasures: () => {},
	getPartAttributes: () => [],
	setNewMusicScore: () => {},
};

export default useMeasures;
