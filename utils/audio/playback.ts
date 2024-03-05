import { IVolumeValueModifer } from '@/types/audio/volume';
import { VolumeManager } from './volume';
import { MusicScore } from '@/types/music';
import { Player, ToneAudioBuffer, context } from 'tone';
import { playMusicScore } from './play-music/play-music';

export class PlaybackManager implements IVolumeValueModifer {
	private volumeManager?: VolumeManager;
	private tonePlayer?: Player;

	playerNodeId = 'player';
	musicScore?: MusicScore;

	constructor(musicScore?: MusicScore) {
		this.musicScore = musicScore;
		// this.volumeManager.addVolumeNode(this.playerNodeId, this.tonePlayer);
	}

	setMusicScore = (musicScore?: MusicScore) => {
		this.musicScore = musicScore;
	};

	setImportedAudio = async (
		audioFile: File,
		completed?: (success: boolean) => void
	) => {
		this.setRequiredFields();

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

	play = () => {
		this.setRequiredFields();
		if (this.musicScore) playMusicScore(this.musicScore, this.volumeManager);
		if (this.tonePlayer) this.tonePlayer.start();
	};

	modifyVolume = (id: string, v: number) => {
		this.setRequiredFields();
		this.volumeManager!.modifyVolume(id, v);
	};

	// TODO: Look into not needing this - NextJS executes client components on the server,
	// which causes certain features Tone needs to work not exist (like AudioBuffer)
	private setRequiredFields = () => {
		if (!this.volumeManager) this.volumeManager = new VolumeManager();
		if (!this.tonePlayer) {
			this.tonePlayer = new Player();
			this.volumeManager.addVolumeNode(this.playerNodeId, this.tonePlayer);
		}
	};
}
