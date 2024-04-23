import { VolumeManager } from './volume';
import { MusicScore } from '@/types/music';
import { Player, ToneAudioBuffer, context } from 'tone';
import { enqueueMusicScore } from './play-music/play-music';
import { deepyCopy, isOnClient, loadFile } from '..';

// TODO: Look into PlaybackManager following single responsibility principle
export class PlaybackManager extends VolumeManager {
	private players: { [id in string]: Player } = {};
	private maxDurationPlayer?: Player;

	readonly playerNodeId = 'Imported Audio';
	musicScore?: MusicScore;

	constructor(musicScore?: MusicScore) {
		super();
		this.musicScore = musicScore;
	}

	// Gets the duration of the longest player of the playback manager - equivalent
	// to the duration of the overall playback manager
	getMaxDuration = () =>
		this.maxDurationPlayer ? this.maxDurationPlayer.buffer.duration : 0;

	getPlaybackState = () => this.maxDurationPlayer?.state;

	private addAudioPlayer = (buffer: ToneAudioBuffer, id: string) => {
		const player = new Player();
		player.buffer = buffer;
		this.players[id] = player;
		this.addVolumeNode(id, player);
		this.updateAudioDuration();
	};

	private removeAudioPlayer = (id: string) => {
		delete this.players[id];
		this.removeVolumeNode(id);
		this.updateAudioDuration();
	};

	private updateAudioDuration = () => {
		this.maxDurationPlayer = undefined;
		for (const player of Object.values(this.players)) {
			if (!this.maxDurationPlayer) this.maxDurationPlayer = player;
			else if (
				player.buffer.duration > this.maxDurationPlayer.buffer.duration
			) {
				this.maxDurationPlayer = player;
			}
		}
	};

	private loadAudioBuffers = async () => {
		if (!this.musicScore) return;

		const enqueuedBuffers = await enqueueMusicScore(this.musicScore);

		for (const { name, buffer } of enqueuedBuffers) {
			this.addAudioPlayer(buffer, name);
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

	setImportedAudio = async (audioFile?: File) => {
		if (!isOnClient()) return;

		if (!audioFile) {
			this.removeAudioPlayer(this.playerNodeId);
			return true;
		}

		let player = this.players[this.playerNodeId];
		if (!player) {
			player = new Player();
			this.addVolumeNode(this.playerNodeId, player);
			this.players[this.playerNodeId] = player;
		}

		const audioData = await loadFile(audioFile, 'array');
		// shouldn't ever be a string because of how we read it, but needed for TypeScript
		if (!audioData || typeof audioData === 'string') return false;

		const buffer = await context.decodeAudioData(audioData);
		const toneAudioBuffer = new ToneAudioBuffer().set(buffer);
		player.buffer = toneAudioBuffer;
		this.updateAudioDuration();
		return true;
	};

	// The time the play button was last clicked
	private lastStartTime = Date.now();
	// The number of seconds into the player the playback manager is in
	private secondsIntoPlayback = 0;

	// NOTE: Currently, only use if you know the playback manager isn't stopped, else
	// lastStartTime won't be correct
	private getCurrentPlayTime = () => (Date.now() - this.lastStartTime) / 1000;

	play = () => {
		for (const player of Object.values(this.players)) {
			if (player.state === 'started') return;
			player.start();
			player.seek(this.secondsIntoPlayback);
		}

		this.lastStartTime = Date.now();
	};

	stop = () => {
		for (const player of Object.values(this.players)) {
			if (player.state === 'stopped') return;
			player.stop();
		}

		this.secondsIntoPlayback += this.getCurrentPlayTime();
	};

	seek = (offsetPercentage: number) => {
		// Clamp the percentage between 0 and 1
		offsetPercentage = Math.max(0, Math.min(offsetPercentage, 1));
		// Update secondsIntoPlayback to reflect the new offset
		this.secondsIntoPlayback = offsetPercentage * this.getMaxDuration();

		// Seek every player to the right position
		for (const player of Object.values(this.players)) {
			player.seek(this.secondsIntoPlayback);
		}

		// Update lastStartTime to now - if the audio is playing, seeking has the
		// same effect as pausing and starting ; if the audio isn't playing, this
		// doesn't mess anything up
		this.lastStartTime = Date.now();
	};

	getOffsetPercentage = () => {
		// If there is no player, the offset percentage is 0%
		if (!this.maxDurationPlayer) return 0;

		let percentage = 0;
		// If the player is stopped, secondsIntoPlayback *should* be updated correctly and
		// it's divided the max player's duration
		if (this.maxDurationPlayer.state === 'stopped')
			percentage = this.secondsIntoPlayback / this.getMaxDuration();
		// Else the player is playing, and we need to get the length of the current play session
		// and add it to secondsIntoPlayback and finally divided it by the max player's duration
		else {
			percentage =
				(this.getCurrentPlayTime() + this.secondsIntoPlayback) /
				this.getMaxDuration();
		}

		// Clamp the percentage between 0 and 1
		return Math.max(0, Math.min(percentage, 1));
	};

	private static extractBufferSection = (
		buffer: ToneAudioBuffer,
		[start, end]: [number, number]
	) => {
		if (start < 0 || end > buffer.duration || start > end) return null;

		const sampleRate = buffer.sampleRate;
		const startSample = Math.floor(start * sampleRate);
		const endSample = Math.floor(end * sampleRate);
		const numSamples = endSample - startSample + 1;

		const originalAudio = buffer.getChannelData(0);
		// const extractedAudio = new Float32Array(numSamples);
		const extractedAudio = originalAudio.slice(startSample, endSample + 1);
		/* for (let i = 0; i < numSamples; i++) {
			extractedAudio[i] = originalAudio[startSample + i];
		} */

		const audioBuffer = new AudioContext().createBuffer(
			1,
			numSamples,
			sampleRate
		);
		audioBuffer.copyToChannel(extractedAudio, 0);

		return audioBuffer;
	};

	copy = (playbackSection?: [number, number]) => {
		const start = playbackSection ? playbackSection[0] : 0;
		const end = playbackSection ? playbackSection[1] : this.getMaxDuration();

		const newManager = new PlaybackManager(this.musicScore);

		for (const id in this.players) {
			const player = this.players[id];
			let curEnd = end;
			if (curEnd > player.buffer.duration) curEnd = player.buffer.duration - 1;
			let curStart = start < end ? start : 0;

			const newBuffer = PlaybackManager.extractBufferSection(player.buffer, [
				curStart,
				curEnd,
			]);
			if (!newBuffer) {
				console.log('BAD RANGE');
				console.log({ start, curEnd, duration: player.buffer.duration });
				continue;
			}
			const newToneBuffer = new ToneAudioBuffer().set(newBuffer);
			newManager.addAudioPlayer(newToneBuffer, id);
		}

		console.log({ newManager });

		return newManager;
	};
}
