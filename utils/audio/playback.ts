import { IVolumeValueModifer } from '@/types/audio/volume';
import { VolumeManager } from './volume';
import { MusicScore } from '@/types/music';
import { Player, Players, ToneAudioBuffer, context } from 'tone';
import { enqueueMusicScore, playMusicScore } from './play-music/play-music';
import { isOnClient } from '..';
import { getInstrument } from './instruments';
import { ToneInstrument } from '@/types/audio/instrument';

export class PlaybackManager extends VolumeManager {
	private players: { [id in string]: Player } = {};
	playerNodeId = 'player';
	musicScore?: MusicScore;

	constructor(musicScore?: MusicScore) {
		super();
		this.musicScore = musicScore;
	}

	private loadAudioBuffers = async () => {
		if (!this.musicScore) return;

		const enqueuedBuffers = await enqueueMusicScore(
			this.musicScore,
			getInstrument
		);

		for (const { name, buffer } of enqueuedBuffers) {
			const player = new Player();
			player.buffer = buffer;
			this.players[name] = player;
			this.addVolumeNode(name, player);
		}
	};

	setMusicScore = async (musicScore?: MusicScore) => {
		if (this.musicScore) {
			this.musicScore.parts.forEach((part) => {
				this.removeVolumeNode(part.attributes.instrument);
				delete this.players[part.attributes.instrument];
			});
		}

		this.musicScore = musicScore;
		if (this.musicScore) await this.loadAudioBuffers();
	};

	setImportedAudio = (
		audioFile?: File,
		completed?: (success: boolean) => void
	) => {
		if (!isOnClient()) return;

		if (!audioFile) {
			delete this.players[this.playerNodeId];
			this.removeVolumeNode(this.playerNodeId);
			if (completed) completed(true);
			return;
		}

		let player = this.players[this.playerNodeId];
		if (!player) {
			player = new Player();
			this.addVolumeNode(this.playerNodeId, player);
			this.players[this.playerNodeId] = player;
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
			player.buffer = toneAudioBuffer;
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
		/* if (this.musicScore)
			playMusicScore(this.musicScore, {
				getInstrumentNode: this.instrumentGetter,
				onPlay: () => {
					if (this.tonePlayer) this.tonePlayer.start();
				},
			});
		else if (this.tonePlayer) this.tonePlayer.start(); */

		for (const player of Object.values(this.players)) {
			player.start();
		}
	};
}
