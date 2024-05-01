import { Selection } from '@/components/hooks/useSelection';
import { EqualityDelegate } from '@/types/modify-score/assigner/metadata';
import { Metronome, Repeat } from '@/types/music';

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

export const selectionsAreEqual: EqualityDelegate<Selection | undefined> = (
	s1?,
	s2?
) => {
	if (!s1 && !s2) return true;
	if (!s1 || !s2) return false;

	return s1.start === s2.start && s1.end === s2.end;
};
