import { Selection } from '@/components/hooks/useSelection';
import { TimeSignature } from '@/components/providers/music/types';
import { EqualityDelegate } from '@/types/modify-score/assigner/metadata';
import { Metronome, Repeat } from '@/types/music';

const basicChecks = (item1: any, item2: any) => {
	if (!item1 && !item2) return true;
	if (!item1 || !item2) return false;
	return null;
};

export const metronomesAreEqual = (m1?: Metronome, m2?: Metronome) => {
	if (!m1 && !m2) return true;
	if (!m1 || !m2) return false;

	return m1.beatNote === m2.beatNote && m1.beatsPerMinute === m2.beatsPerMinute;
};

export const repeatsAreEqual: EqualityDelegate<Repeat | undefined> = (
	r1?,
	r2?
) => {
	if (!r1 && !r2) return true;
	if (!r1 || !r2) return false;

	if (!r1.forward && !r2.forward) return r1.repeatCount === r2.repeatCount;
	else return r1.forward === r2.forward;
};

export const timeSignaturesAreEqal: EqualityDelegate<
	TimeSignature | undefined
> = (tS1?, tS2?) => {
	const baseChecks = basicChecks(tS1, tS2);
	if (baseChecks !== null) return baseChecks;

	// Shouldn't be undefined / null
	return (
		tS1?.beatNote === tS2?.beatNote &&
		tS1?.beatsPerMeasure === tS2?.beatsPerMeasure
	);
};

export const selectionsAreEqual: EqualityDelegate<Selection | undefined> = (
	s1?,
	s2?
) => {
	if (!s1 && !s2) return true;
	if (!s1 || !s2) return false;

	return s1.start === s2.start && s1.end === s2.end;
};
