import { ToneInstrument } from '@/types/audio/instrument';
import {
	InstrumentAttributes,
	InstrumentEnvelope,
	PartialIA,
} from '@/types/music/note-annotations';
import * as Tone from 'tone';
import { deepyCopy } from '..';

export const updateInstrument = (
	instrument: ToneInstrument,
	instrumentAttributes?: PartialIA
) => {
	if (!instrumentAttributes) return;

	instrument.set(instrumentAttributes);
};

const synth = () => new Tone.Synth();
const polySynth = () => new Tone.PolySynth();
const sampler = () => new Tone.Sampler();

export const getInstrument = (name: string): ToneInstrument => {
	const instrument = synth();

	return instrument;
};

export const getDefaultInstrumentEnvelope = () => {
	const envelope: InstrumentEnvelope = {
		attack: 0.005, // 0.005
		decay: 0.1, // 0.1
		sustain: 0.3, // 0.3
		release: 0.75, // 1
	};

	return envelope;
};

export const getDefaultInstrumentAttributes = () => {
	const attributes: InstrumentAttributes = {
		envelope: getDefaultInstrumentEnvelope(),
		velocity: 0.3,
		portamento: 0,
	};
	return attributes;
};
