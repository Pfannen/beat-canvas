import { Measure } from '@/components/providers/music/types';
import { IndexSeconds } from '@/utils/music/time/index-seconds-class';
import { getIndexEndTimes } from '@/utils/music/time/measures';
import { useEffect, useRef, useState } from 'react';

// NOTE: We don't expect nonExpandedMeasures to change once this hook is used
// NOTE: secondsIntoPlayback should be updated regularly (like with usePolling)
export const useSecondsToMeasureIndex = (
	secondsIntoPlayback: number,
	nonExpandedMeasures: Measure[]
) => {
	console.log({ secondsIntoPlayback });
	const indexSecondsRef = useRef<IndexSeconds>();

	useEffect(() => {
		const indexSeconds = getIndexEndTimes(nonExpandedMeasures);
		indexSecondsRef.current = new IndexSeconds(indexSeconds);
	}, [nonExpandedMeasures]);

	const [measureIdx, setMeasureIdx] = useState<number | null>(0);

	const newIdx = indexSecondsRef.current?.getIndex(secondsIntoPlayback);
	if (newIdx === undefined) setMeasureIdx(null);
	else if (newIdx !== measureIdx) setMeasureIdx(newIdx);

	return {
		measureIdx,
	};
};
