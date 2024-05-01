import { MusicScore } from '@/types/music';
import { isOnClient, loadFile } from '..';
import { PlaybackManager } from './playback';
import { enqueueMusicScore } from './play-music/play-music';
import { BasicPlaybackState, Player, ToneAudioBuffer, context } from 'tone';
import { MusicPlaybackState, MusicVolumePairMap } from '@/types/audio/volume';
import { createVolumePair } from './volume';

// A sub class of PlaybackManager that provides support for adding an audio file and a music score
export class MusicPlaybackManager extends PlaybackManager {
	readonly importedAudioId = 'Imported Audio';
	private musicPlaybackState: MusicPlaybackState;
	musicScore?: MusicScore;

	constructor(musicScore?: MusicScore) {
		super();
		this.musicScore = musicScore;
	}

	protected loadAudioBuffers = async () => {
		if (!this.musicScore) return;

		const prevState = this.musicPlaybackState;
		this.setMusicPlaybackState('enqueueing');
		this.stop();
		const enqueuedBuffers = await enqueueMusicScore(this.musicScore);

		for (const { name, buffer } of enqueuedBuffers) {
			this.addAudioPlayer(buffer, name);
		}

		this.setMusicPlaybackState(prevState);
	};

	protected removeAudioBuffers = () => {
		if (this.musicScore) {
			this.musicScore.parts.forEach((part) => {
				this.removeAudioPlayer(part.attributes.name);
			});
		}
	};

	private setMusicPlaybackState = (state?: MusicPlaybackState) => {
		this.musicPlaybackState = state;
	};

	setMusicScore = async (musicScore?: MusicScore) => {
		if (this.musicScore === musicScore) {
			console.log('They equal');
			return false;
		}

		this.removeAudioBuffers();

		if (this.musicScore) {
			await this.loadAudioBuffers();
		}

		return true;
	};

	newMusicScore = (musicScore?: MusicScore) => {
		if (this.musicScore !== musicScore) {
			this.stop();
			this.removeAudioBuffers();
			if (!musicScore) this.setMusicPlaybackState();
			else this.setMusicPlaybackState('requires enqueue');
			this.musicScore = musicScore;
		}
	};

	enqueueLoadedScore = async () => {
		if (this.musicPlaybackState !== 'requires enqueue') return;

		await this.loadAudioBuffers();
		this.setMusicPlaybackState();
	};

	setImportedAudio = async (audioFile?: File) => {
		if (!isOnClient()) return;

		this.removeAudioPlayer(this.importedAudioId);
		if (!audioFile) {
			return true;
		}

		const prevState = this.musicPlaybackState;
		this.setMusicPlaybackState('enqueueing');

		const audioData = await loadFile(audioFile, 'array');
		// shouldn't ever be a string because of how we read it, but needed for TypeScript
		if (!audioData || typeof audioData === 'string') return false;

		const buffer = await context.decodeAudioData(audioData);
		const toneAudioBuffer = new ToneAudioBuffer().set(buffer);
		this.addAudioPlayer(toneAudioBuffer, this.importedAudioId);

		this.setMusicPlaybackState(prevState);
		return true;
	};

	copy = (playbackSection?: [number, number]) => {
		const newManager = new MusicPlaybackManager(this.musicScore);
		this.copyToManager(newManager, playbackSection);
		return newManager;
	};

	getMusicPlaybackState = () => {
		return this.musicPlaybackState || this.getPlaybackState();
	};

	play = async () => {
		await this.enqueueLoadedScore();
		super.play();
		this.setMusicPlaybackState();
	};

	getMusicVolumePairs = () => {
		const musicVolumePairs: MusicVolumePairMap = {
			master: [],
			imported: [],
			score: new Array(this.musicScore?.parts.length || 0),
		};

		const volumePairs = this.getVolumeIdToPercentageMap();
		if (this.masterVolumeId in volumePairs) {
			musicVolumePairs.master.push(
				createVolumePair(this.masterVolumeId, volumePairs[this.masterVolumeId])
			);
		}
		if (this.importedAudioId in volumePairs) {
			musicVolumePairs.imported.push(
				createVolumePair(
					this.importedAudioId,
					volumePairs[this.importedAudioId]
				)
			);
		}
		this.musicScore?.parts.forEach(({ attributes: { name } }) => {
			if (volumePairs[name] !== undefined) {
				musicVolumePairs.score.push(createVolumePair(name, volumePairs[name]));
			}
		});

		return musicVolumePairs;
	};
}
