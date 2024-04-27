import { ToneInstrument } from '@/types/audio/instrument';
import {
	InstrumentAttributes,
	InstrumentEnvelope,
} from '@/types/music/note-annotations';
import * as Tone from 'tone';
import { deepyCopy } from '..';

export const updateInstrument = (
	instrument: ToneInstrument,
	targetEnvelope?: Partial<InstrumentEnvelope>
) => {
	if (!targetEnvelope) return;

	instrument.set({ envelope: targetEnvelope });

	/* const { envelope } = instrument;
	if (envelope) Object.assign(envelope, targetEnvelope); */

	// TODO: Look into envelope and portamento on sampler and poly synth
	/* const { attack, sustain, decay, release, portamento } = instrumentProps;
	const { envelope } = instrument;
	if (attack !== undefined) envelope.attack = attack;
	if (sustain !== undefined) envelope.sustain = sustain;
	if (decay !== undefined) envelope.decay = decay;
	if (release !== undefined) envelope.release = release;
	if (portamento !== undefined) instrument.portamento = portamento; */
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
		release: 1, // 1
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
