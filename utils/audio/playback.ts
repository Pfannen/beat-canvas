import { VolumeManager } from './volume';
import { BasicPlaybackState, Player, ToneAudioBuffer } from 'tone';
import {
	toneBuffersToAudioBuffer,
	toneBufferToAudioBuffer,
} from '../import-export/audio-buffer-utils';
import { ToneBufferVolumePair } from '@/types/audio/volume';

// TODO: Look into PlaybackManager following single responsibility principle
// NOTE: Could probably make another sub class for handling imported audio and music score
export class PlaybackManager extends VolumeManager {
	private players: { [id in string]: Player } = {};
	private maxDurationPlayer?: Player;
	private playbackState: BasicPlaybackState | undefined;

	constructor() {
		super();
	}

	// Gets the duration of the longest player of the playback manager - equivalent
	// to the duration of the overall playback manager
	getMaxDuration = () =>
		this.maxDurationPlayer ? this.maxDurationPlayer.buffer.duration : 0;

	getPlaybackState = () => this.playbackState;

	protected addAudioPlayer = (buffer: ToneAudioBuffer, id: string) => {
		const player = new Player();
		player.buffer = buffer;
		this.players[id] = player;
		this.addVolumeNode(id, player);
		this.updateAudioDuration();
	};

	protected removeAudioPlayer = (id: string) => {
		delete this.players[id];
		this.removeVolumeNode(id);
		this.updateAudioDuration();
	};

	private updateAudioDuration = () => {
		if (this.maxDurationPlayer) this.maxDurationPlayer.onstop = () => {};
		this.maxDurationPlayer = undefined;
		for (const player of Object.values(this.players)) {
			if (!this.maxDurationPlayer) this.maxDurationPlayer = player;
			else if (
				player.buffer.duration > this.maxDurationPlayer.buffer.duration
			) {
				this.maxDurationPlayer = player;
			}
		}
		if (this.maxDurationPlayer)
			this.maxDurationPlayer.onstop = () => {
				//NOTE: Calling 'seek' triggers onstop, so we need to check if it's actually stopped
				if (this.maxDurationPlayer?.state === 'stopped') this.stop();
			};
	};

	// The time the play button was last clicked
	private lastStartTime = Date.now();
	// The number of seconds into the player the playback manager is in
	private secondsIntoPlayback = 0;

	// NOTE: Currently, only use if you know the playback manager isn't stopped, else
	// lastStartTime won't be correct
	private getCurrentPlayTime = () => (Date.now() - this.lastStartTime) / 1000;

	play() {
		if (this.getPlaybackState() === 'started') return;

		for (const player of Object.values(this.players)) {
			if (player.state === 'started') continue;
			player.start();
			player.seek(this.secondsIntoPlayback);
		}

		this.lastStartTime = Date.now();
		this.playbackState = 'started';
	}

	stop = () => {
		if (this.getPlaybackState() === 'stopped') return;

		for (const player of Object.values(this.players)) {
			if (player.state === 'stopped') continue;
			player.stop();
		}

		this.secondsIntoPlayback += this.getCurrentPlayTime();
		this.playbackState = 'stopped';
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
		if (this.maxDurationPlayer.state === 'stopped') {
			percentage = this.secondsIntoPlayback / this.getMaxDuration();
		}
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

	protected copyToManager = (
		newManager: PlaybackManager,
		playbackSection?: [number, number]
	) => {
		const start = playbackSection ? playbackSection[0] : 0;
		const end = playbackSection ? playbackSection[1] : this.getMaxDuration();

		for (const id in this.players) {
			const player = this.players[id];
			let curEnd = end;
			if (curEnd > player.buffer.duration) curEnd = player.buffer.duration - 1;
			let curStart = start <= end ? start : 0;

			const newBuffer = toneBufferToAudioBuffer(player.buffer, [
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
	};

	copy = (playbackSection?: [number, number]) => {
		/* const start = playbackSection ? playbackSection[0] : 0;
		const end = playbackSection ? playbackSection[1] : this.getMaxDuration();
		
		const newManager = new PlaybackManager(this.musicScore); */
		const newManager = new PlaybackManager();
		this.copyToManager(newManager, playbackSection);

		console.log({ newManager });

		return newManager;
	};

	getMergedAudioBufffer = async () => {
		const volumePairs = this.getVolumePairs();

		const toneVolumePairs: ToneBufferVolumePair[] = [];
		volumePairs.forEach(({ audioId, volumePercentage }) => {
			if (audioId in this.players) {
				toneVolumePairs.push({
					buffer: this.players[audioId].buffer,
					volumePercentage,
				});
			}
		});
		return await toneBuffersToAudioBuffer(toneVolumePairs);
	};
}
