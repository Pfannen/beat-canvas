import { Metronome } from '@/types/music';

export const metronomesAreEqual = (m1?: Metronome, m2?: Metronome) => {
	if (!m1 && !m2) return true;
	if (!m1 || !m2) return false;

	return m1.beatNote === m2.beatNote && m1.beatsPerMinute === m2.beatsPerMinute;
};
