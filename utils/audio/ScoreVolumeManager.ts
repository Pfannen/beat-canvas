import {
	ToneInstrument,
	ToneInstrumentSpecifier,
} from '@/types/audio/instrument';
import { ScoreVolumeModifier, ToneInstrumentMap } from '@/types/audio/volume';
import { Volume } from 'tone';

export class ScoreVolumeManager extends ScoreVolumeModifier {
	private static maxDecibels = 12;
	private static instrumentMap?: ToneInstrumentMap;
	private static masterVolume?: Volume;

	static musicScoreName?: string;
	static masterAudioId = 'master';

	private static getVolumeValue = (volumePct: number) => {
		if (volumePct === 0) return -Infinity;

		if (volumePct > 1 || volumePct < 0) volumePct = 0.5;
		// 0.5 - volumePct lets us go to negative and positive values of maxDecibels
		// Look into a better way to get volume value w/ ToneJS, for some reason volume.value = 0 doesn't mute audio
		volumePct = (0.5 - volumePct) * -1;
		return this.maxDecibels * volumePct;
	};

	static modifyVolume = (audioId: string, volumePct: number) => {
		const volumeValue = this.getVolumeValue(volumePct);

		if (this.instrumentMap && audioId in this.instrumentMap) {
			this.instrumentMap[audioId].volume.value = volumeValue;
		} else if (this.masterVolume && audioId === this.masterAudioId) {
			this.masterVolume.volume.value = volumeValue;
		}
	};

	static getInstrument = (instrumentId: string) => {
		if (this.instrumentMap && instrumentId in this.instrumentMap)
			return this.instrumentMap[instrumentId];
	};

	static getInstrumentsIfAllExist = (instrumentIds: string[]) => {
		if (!this.instrumentMap) return null;

		const instruments: ToneInstrumentMap = {};
		for (const id of instrumentIds) {
			if (id in this.instrumentMap) instruments[id] = this.instrumentMap[id];
			else return null;
		}

		return instruments;
	};

	static setInstruments = (
		musicScoreName: string,
		instruments: ToneInstrumentSpecifier[],
		masterVolume?: Volume
	) => {
		this.musicScoreName = musicScoreName;
		this.instrumentMap = {};
		for (const { id, instrument } of instruments) {
			this.instrumentMap[id] = instrument;
		}

		this.masterVolume = masterVolume;
	};
}
