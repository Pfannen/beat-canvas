import { VolumeManager } from './volume';
import { MusicScore } from '@/types/music';
import { Player, ToneAudioBuffer, context } from 'tone';
import { enqueueMusicScore } from './play-music/play-music';
import { isOnClient } from '..';

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
		this.updateAudioDuration();
	};

	setImportedAudio = (
		audioFile?: File,
		completed?: (success: boolean) => void
	) => {
		if (!isOnClient()) return;

		if (!audioFile) {
			delete this.players[this.playerNodeId];
			this.removeVolumeNode(this.playerNodeId);
			this.updateAudioDuration();
			if (completed) completed(true);
			return;
		}

		let player = this.players[this.playerNodeId];
		if (!player) {
			player = new Player();
			this.addVolumeNode(this.playerNodeId, player);
			this.players[this.playerNodeId] = player;
		}

		// TODO: Make file reading use the promise API
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
			this.updateAudioDuration();
			if (completed) completed(true);
		};

		reader.readAsArrayBuffer(audioFile);
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
}
