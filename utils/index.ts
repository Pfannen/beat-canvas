import { UnitMeasurement } from "@/types";

export const fractionToPercent = (val: number) => numToUnit(val, "%");

export const numToUnit = (val: number, unit: 'px' | '%' | 'deg') => {
	if (unit === '%') {
		val *= 100;
	}
	return val + unit;
};

export const appendUnit = (val: number, unit: UnitMeasurement) => val + unit;

export const numIsUndefined = <T>(val?: number) =>
	val === undefined ? false : true;

export const getDecimalPortion = (val: number) => val % 1;

export const numIsEven = (num: number) => num % 2 === 0;

export const isOnClient = () => typeof window !== 'undefined';

export const loadFile = async (
	file: File,
	readAs: 'text' | 'array' | 'url'
): Promise<string | ArrayBuffer | null> => {
	return new Promise((res) => {
		const fileReader = new FileReader();
		fileReader.onload = (event) => {
			if (!event.target) return res(null);
			else res(event.target.result);
		};

		if (readAs === 'text') fileReader.readAsText(file);
		else if (readAs === 'array') fileReader.readAsArrayBuffer(file);
		else fileReader.readAsDataURL(file);
	});
};

export const deepyCopy = <T>(item: T): T => {
	return JSON.parse(JSON.stringify(item));
};

export const mergePartial = <T extends Record<any, any>>(
  objOne: T,
  objTwo?: Partial<T>
) => {
  for (const key in objTwo) {
    objOne[key] = objTwo[key]!;
  }
};

export const indexIsValid = (index: number, length: number) => {
	return index >= 0 && index < length;
};

export const indexRangeIsValid = (
	startIndex: number,
	endIndex: number,
	length: number
) => {
	return (
		indexIsValid(startIndex, length) &&
		indexIsValid(endIndex, length) &&
		startIndex <= endIndex
	);
};

export const getValueFromRange = (
	rangeLow: number,
	rangeHigh: number,
	percentage: number
) => {
	if (percentage <= 0) return rangeLow;
	if (percentage >= 1) return rangeHigh;

	// Use to normalize range to start at 0
	// Example: rangeLow = -10 -> offset = 10 | rangeLow = 50 -> offset = -50
	const offset = rangeLow * -1;

	// Calculate the normalized range high
	// Example: offset = 10, rangeHigh = 50 -> range is 0 - 60 | offset = -50, rangeHigh = 100 -> range is 0 - 50
	const max = rangeHigh + offset;
	// Calculate the normalized percentage value
	const valueWithOffset = percentage * max;
	// Adjust the normalized value against the offset to get back into original range
	const value = valueWithOffset - offset;

	return value;
};

export const getPercentageFromRange = (
	rangeLow: number,
	rangeHigh: number,
	value: number
) => {
	const offset = rangeLow * -1;
	const max = rangeHigh + offset;
	return (value + offset) / max;
};
