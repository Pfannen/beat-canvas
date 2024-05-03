import { TimeSignature } from '@/components/providers/music/types';
import { Metronome } from '@/types/music';
import {
	getQuarterNotesPerMeasure,
	getSecondsBetweenXs,
	getSecondsPerQuarterNote,
} from '@/utils/music/time';
import { equal } from 'assert';

const createMetronome = (bpm: number, bN: number) => {
	const met: Metronome = {
		beatsPerMinute: bpm,
		beatNote: bN,
	};

	return met;
};

const createTimeSignature = (bpm: number, bN: number) => {
	const ts: TimeSignature = {
		beatsPerMeasure: bpm,
		beatNote: bN,
	};

	return ts;
};

test('Metronome: 60 / 4', () => {
	const met = createMetronome(60, 4);
	const sPQN = getSecondsPerQuarterNote(met);
	equal(sPQN, 1);
});

test('Metronome: 60 / 8', () => {
	const met = createMetronome(60, 8);
	const sPQN = getSecondsPerQuarterNote(met);
	equal(sPQN, 2);
});

test('Metronome: 144 / 8', () => {
	const met = createMetronome(144, 8);
	const sPQN = getSecondsPerQuarterNote(met);
	equal(sPQN, 1 / (144 * (1 / 60) * 0.5));
});

test('Metronome: 30 / 16', () => {
	const met = createMetronome(30, 16);
	const sPQN = getSecondsPerQuarterNote(met);
	equal(sPQN, 1 / (30 * (1 / 60) * 0.25));
});

test('Metronome: 126 / 2', () => {
	const met = createMetronome(126, 2);
	const sPQN = getSecondsPerQuarterNote(met);
	equal(sPQN, 1 / (126 * (1 / 60) * 2));
});

test('Time signature: 4 / 4', () => {
	const ts = createTimeSignature(4, 4);
	const qNPM = getQuarterNotesPerMeasure(ts);
	equal(qNPM, 4);
});

test('Time signature: 3 / 8', () => {
	const ts = createTimeSignature(3, 8);
	const qNPM = getQuarterNotesPerMeasure(ts);
	equal(qNPM, (4 / 8) * 3);
});

test('Time signature: 12 / 16', () => {
	const ts = createTimeSignature(12, 16);
	const qNPM = getQuarterNotesPerMeasure(ts);
	equal(qNPM, (4 / 16) * 12);
});

test('Time signature: 1 / 2', () => {
	const ts = createTimeSignature(1, 2);
	const qNPM = getQuarterNotesPerMeasure(ts);
	equal(qNPM, (4 / 2) * 1);
});

test('Seconds between 0-0.5 | Met: 60 / 4 | TS: 4 / 4', () => {
	const met = createMetronome(60, 4);
	const ts = createTimeSignature(4, 4);
	const secondsBetween = getSecondsBetweenXs(0, 0.5, met, ts);
	equal(secondsBetween, 0.5);
});

test('Seconds between 0.25-0.5 | Met: 60 / 4 | TS: 4 / 4', () => {
	const met = createMetronome(60, 4);
	const ts = createTimeSignature(4, 4);
	const secondsBetween = getSecondsBetweenXs(0, 0.25, met, ts);
	equal(secondsBetween, 0.25);
});

test('Seconds between 0.75-1.5 | Met: 120 / 4 | TS: 3 / 4', () => {
	const met = createMetronome(120, 4);
	const ts = createTimeSignature(3, 4);
	const secondsBetween = getSecondsBetweenXs(0.75, 1.5, met, ts);
	equal(secondsBetween, 0.75 / 2);
});
