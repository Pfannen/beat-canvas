import { Measure } from '@/components/providers/music/types';
import { MeasureAttributes, RequiredMeasureAttributes } from '@/types/music';
import { deepyCopy } from '@/utils';
import {
	getMeasureAttributes,
	getRequiredMeasureAttributes,
	getTemporalAttributesAtX,
} from '@/utils/music/measures/measure-attributes';
import { noteAttributeGenerator } from '@/utils/music/measures/traversal';
import { useEffect, useRef, useState } from 'react';

const useMeasureRange = (
	getMeasures: (start: number, count: number, copy?: boolean) => Measure[],
	startIndex: number,
	endIndex: number
) => {
	const [rangedMeasures, setRangedMeasures] = useState<Measure[]>(() =>
		getMeasures(startIndex, endIndex - startIndex + 1, true)
	);

	// We use an initial and current meausre attribute cache for efficient MA retrieval
	// The initial attributes never change and are used to fill in the gaps of the first ranged measure
	// every time it updates. The complete measure attributes of the first ranged measure are stored in currentMACache
	// NOTE: Make sure initializer isn't getting executed on every rerender
	const initialMACache = useRef<RequiredMeasureAttributes | null>(null);
	const currentMACache = useRef<MeasureAttributes | null>(null);

	// Make sure initial measure attribute cache only gets set once
	useEffect(() => {
		initialMACache.current = getRequiredMeasureAttributes(
			getMeasures(0, startIndex + 1, true),
			startIndex
		);
		currentMACache.current = initialMACache.current;
	}, [getMeasures, startIndex]);

	// Update the attribute cache to match that of the first measure
	useEffect(() => {
		if (initialMACache.current && rangedMeasures.length) {
			const newAttributes = { ...initialMACache.current };
			Object.assign(newAttributes, rangedMeasures[0].staticAttributes);
			Object.assign(
				newAttributes,
				getTemporalAttributesAtX(rangedMeasures[0], 0)
			);
			currentMACache.current = newAttributes;
		}
	}, [rangedMeasures]);

	// Gets the attributes for the measure at the given index and x position
	const getAttributes = (
		measureIndex: number,
		x = 0
	): MeasureAttributes | null => {
		if (measureIndex >= rangedMeasures.length || measureIndex < 0) return null;

		// Get the attributes of the desired measure and x position
		// Attributes shouldn't be null because the given measure index was checked
		const attributes = getMeasureAttributes(
			rangedMeasures,
			measureIndex,
			currentMACache.current || undefined,
			x
		);
		// Return null (if the attributes were null) or a copy of the attributes
		return attributes && { ...attributes };
	};

	const getRangedMeasures = () => deepyCopy(rangedMeasures);

	const getRangedMeasureAtIndex = (index: number) =>
		deepyCopy(rangedMeasures[index]);

	// Is this function needed?
	function* iterateRangedMeasures() {
		for (const yieldObj of noteAttributeGenerator(
			rangedMeasures,
			currentMACache.current || undefined
		)) {
			yield yieldObj;
		}
	}

	return {
		getRangedMeasures,
		getRangedMeasureAtIndex,
		setRangedMeasures,
		getAttributes,
		iterateRangedMeasures,
	};
};

export default useMeasureRange;
