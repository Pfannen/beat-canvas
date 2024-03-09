import { IVolumeValueModifer } from '@/types/audio/volume';
import { VolumeManager } from './volume';
import { MusicScore } from '@/types/music';
import { Player, ToneAudioBuffer, context } from 'tone';
import { playMusicScore } from './play-music/play-music';
import { isOnClient } from '..';
import { getInstrument } from './instruments';
import { ToneInstrument } from '@/types/audio/instrument';

export class PlaybackManager extends VolumeManager {
	private tonePlayer: Player | null = null;

	playerNodeId = 'player';
	musicScore?: MusicScore;

	constructor(musicScore?: MusicScore) {
		super();
		this.musicScore = musicScore;
	}

	setMusicScore = (musicScore?: MusicScore) => {
		if (this.musicScore) {
			this.musicScore.parts.forEach((part) =>
				this.removeVolumeNode(part.attributes.instrument)
			);
		}

		this.musicScore = musicScore;
		if (this.musicScore) {
			this.musicScore.parts.forEach((part) =>
				this.addVolumeNode(
					part.attributes.instrument,
					getInstrument(part.attributes.instrument)
				)
			);
		}
	};

	setImportedAudio = (
		audioFile?: File,
		completed?: (success: boolean) => void
	) => {
		if (!isOnClient()) return;

		if (!audioFile) {
			this.tonePlayer?.dispose();
			this.tonePlayer = null;
			this.removeVolumeNode(this.playerNodeId);
			if (completed) completed(true);
			return;
		}

		if (!this.tonePlayer) {
			this.tonePlayer = new Player();
			this.addVolumeNode(this.playerNodeId, this.tonePlayer);
		}

		const reader = new FileReader();
		reader.onload = async (e) => {
			const audioData = e.target?.result;
			// shouldn't ever be a string because of how we read it, but needed for TypeScript
			if (!audioData || typeof audioData === 'string') {
				if (completed) completed(false);
				return;
			}

			const buffer = await context.decodeAudioData(audioData);
			const toneAudioBuffer = new ToneAudioBuffer().set(buffer);
			this.tonePlayer!.buffer = toneAudioBuffer;
			if (completed) completed(true);
		};

		reader.readAsArrayBuffer(audioFile);
	};

	private instrumentGetter = (name: string) => {
		const node = this.getVolumeNode(name);
		if (!node) return null;
		else return node as ToneInstrument;
	};

	play = () => {
		if (this.musicScore) playMusicScore(this.musicScore, this.instrumentGetter);
		if (this.tonePlayer) this.tonePlayer.start();
	};
}
