import {
	ToneInstrument,
	ToneInstrumentSpecifier,
} from '@/types/audio/instrument';
import { ScoreVolumeModifier, ToneInstrumentMap } from '@/types/audio/volume';
import { Volume } from 'tone';

export class ScoreVolumeManager extends ScoreVolumeModifier {
	private static maxDecibels = 10;
	private static minDecibels = -30;
	static defaultVolumePct = 0.5;

	private static instrumentMap?: ToneInstrumentMap;
	private static masterVolume?: Volume;

	static musicScoreName?: string;
	static masterAudioId = 'master';

	private static getVolumeValue = (volumePct: number) => {
		if (volumePct === 0) return -Infinity;

		const maxDecibelOffset =
			this.minDecibels < 0 ? this.minDecibels * -1 : this.minDecibels;

		const max = this.maxDecibels + maxDecibelOffset;
		const volumeWithOffset = volumePct * max;
		const volume = volumeWithOffset - maxDecibelOffset;

		return volume;
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
		const volumeValue = this.getVolumeValue(this.defaultVolumePct);
		for (const { id, instrument } of instruments) {
			this.instrumentMap[id] = instrument;
			instrument.volume.value = volumeValue;
		}

		this.masterVolume = masterVolume;
		if (masterVolume) masterVolume.volume.value = volumeValue;
	};
}
