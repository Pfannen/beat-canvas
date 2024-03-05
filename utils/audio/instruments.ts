import { ToneInstrument } from '@/types/audio/instrument';
import { InstrumentProps } from '@/types/music/note-annotations';
import * as Tone from 'tone';

export const updateInstrument = (
	instrument: ToneInstrument,
	instrumentProps?: Partial<InstrumentProps>
) => {
	if (!instrumentProps) return;

	//instrument.set(instrumentProps);

	const { envelope } = instrument;
	if (envelope) Object.assign(envelope, instrumentProps);

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

export const getDefaultInstrumentProps = () => {
	const defaultProps: InstrumentProps = {
		attack: 0.005, // 0.005
		decay: 0.1, // 0.1
		sustain: 0.3, // 0.3
		release: 1, // 1
		portamento: 0, // 0
	};
	return defaultProps;
};
