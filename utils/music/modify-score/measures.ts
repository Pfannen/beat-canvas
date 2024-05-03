import { Measure } from '@/components/providers/music/types';
import {
	MeasureAttributes,
	dynamicMeasureAttributesKeys,
	staticMeasureAttributesKeys,
} from '../../../types/music';

export const modifyMeasureAttribute = <K extends keyof MeasureAttributes>(
	x: number,
	measures: Measure[],
	measureNumber: number,
	attributeName: K,
	value?: MeasureAttributes[K]
) => {
	// The attributes we'll end up modifying - either static or dynamic
	let modify: Partial<MeasureAttributes> = {};
	const measure = measures[measureNumber];
	let temporalIdx = -1;

	// If the attribute to update is static
	if (staticMeasureAttributesKeys.has(attributeName)) {
		if (measure.staticAttributes) modify = measure.staticAttributes;
		else measure.staticAttributes = modify;
	}
	// If the attribute to update is dynamic
	else if (dynamicMeasureAttributesKeys.has(attributeName)) {
		// If there's no temporal attributes, we'll create them and set 'modify' to an empty object
		// that the 'attributes' key will map to
		if (!measure.temporalAttributes) {
			if (value !== undefined) {
				measure.temporalAttributes = [{ x, attributes: modify }];
			}
		} else {
			const { temporalAttributes } = measure;
			// TODO: Update to use binary search to make for a more efficient look up
			// Find the temporal attributes we need to modify
			for (let i = 0; i < temporalAttributes.length; i++) {
				const { x: attrX, attributes } = temporalAttributes[i];

				// If there's temporal attributes with the x we're looking for
				if (attrX === x) {
					modify = attributes;
					temporalIdx = i;
					break;
				}
				// Else if we've went past the x we're looking for, add a space for it
				// and set 'modify' to an empty object that the 'attributes' key will map to IF we're adding an attribute
				else if (attrX > x) {
					if (value !== undefined) {
						measure.temporalAttributes.splice(i - 1, 0, {
							x,
							attributes: modify,
						});
						temporalIdx = i;
					}
					// Don't continue iterating, we've found the attributes to modify
					break;
				}
			}
			if (temporalIdx === -1 && value !== undefined) {
				measure.temporalAttributes.push({ x, attributes: modify });
				temporalIdx = measure.temporalAttributes.length - 1;
			}
		}
	}

	if (value !== undefined) {
		modify[attributeName] = value;
	} else {
		delete modify[attributeName];

		// If the deletion of the value resulted in attribute store having 0 attributes, clean up
		if (Object.keys(modify).length === 0) {
			if (staticMeasureAttributesKeys.has(attributeName)) {
				delete measure.staticAttributes;
			} else if (measure.temporalAttributes && temporalIdx !== -1) {
				measure.temporalAttributes.splice(temporalIdx, 1);
				if (measure.temporalAttributes.length === 0)
					delete measure.temporalAttributes;
			}
		}
	}
};
