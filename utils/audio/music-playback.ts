import { MusicScore } from '@/types/music';
import { isOnClient, loadFile } from '..';
import { PlaybackManager } from './playback';
import { enqueueMusicScore } from './play-music/play-music';
import { Player, ToneAudioBuffer, context } from 'tone';
import { MusicVolumePairMap } from '@/types/audio/volume';
import { createVolumePair } from './volume';

// A sub class of PlaybackManager that provides support for adding an audio file and a music score
export class MusicPlaybackManager extends PlaybackManager {
	readonly importedAudioId = 'Imported Audio';
	musicScore?: MusicScore;

	constructor(musicScore?: MusicScore) {
		super();
		this.musicScore = musicScore;
	}

	protected loadAudioBuffers = async () => {
		if (!this.musicScore) return;

		console.log({ enqueueingScore: this.musicScore.parts[0].measures });
		const enqueuedBuffers = await enqueueMusicScore(this.musicScore);

		for (const { name, buffer } of enqueuedBuffers) {
			this.addAudioPlayer(buffer, name);
		}
	};

	setMusicScore = async (musicScore?: MusicScore) => {
		if (this.musicScore === musicScore) {
			console.log('They equal');
			return;
		}

		if (this.musicScore) {
			this.musicScore.parts.forEach((part) => {
				this.removeAudioPlayer(part.attributes.name);
			});
		}

		this.musicScore = musicScore;
		if (this.musicScore) await this.loadAudioBuffers();
	};

	setImportedAudio = async (audioFile?: File) => {
		if (!isOnClient()) return;

		this.removeAudioPlayer(this.importedAudioId);
		if (!audioFile) {
			return true;
		}

		const audioData = await loadFile(audioFile, 'array');
		// shouldn't ever be a string because of how we read it, but needed for TypeScript
		if (!audioData || typeof audioData === 'string') return false;

		const buffer = await context.decodeAudioData(audioData);
		const toneAudioBuffer = new ToneAudioBuffer().set(buffer);
		this.addAudioPlayer(toneAudioBuffer, this.importedAudioId);
		return true;
	};

	copy = (playbackSection?: [number, number]) => {
		const newManager = new MusicPlaybackManager(this.musicScore);
		this.copyToManager(newManager, playbackSection);
		return newManager;
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
