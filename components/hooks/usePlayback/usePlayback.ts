import { IVolumeValueModifer, VolumePair } from '@/types/audio/volume';
import { MusicScore } from '@/types/music';
import { PlaybackManager } from '@/utils/audio/playback';
import { useEffect, useRef, useState } from 'react';
import { BasicPlaybackState } from 'tone';
import { usePolling } from '../usePolling';

export const usePlayback = () => {
	const playbackManager = useRef<PlaybackManager>(new PlaybackManager());
	const volumeModifier = playbackManager.current as IVolumeValueModifer;

	const { pollValue, startPolling, stopPolling, updatePollValue } = usePolling(
		500,
		playbackManager.current.getOffsetPercentage
	);

	const [volumePairs, setVolumePairs] = useState<VolumePair[]>([]);
	const [playbackState, setPlaybackState] = useState<
		BasicPlaybackState | undefined
	>();

	const updatePlaybackState = () =>
		setPlaybackState(playbackManager.current.getPlaybackState());

	const updateVolumePairs = () => {
		const newVolumePairs = playbackManager.current.getVolumePairs();
		setVolumePairs(newVolumePairs);
	};

	const adjustPolling = () => {
		if (playbackState === 'started') startPolling();
		else {
			stopPolling();
			updatePollValue();
		}
	};

	const setScore = async (score?: MusicScore) => {
		await playbackManager.current.setMusicScore(score);
		updateVolumePairs();
		updatePlaybackState();
	};

	//TODO: have status for importing bad audio file
	const setImportedAudio = async (audioFile?: File) => {
		await playbackManager.current.setImportedAudio(audioFile);
		updateVolumePairs();
		updatePlaybackState();
	};

	const playMusic = () => {
		playbackManager.current.play();
		updatePlaybackState();
	};

	const stopMusic = () => {
		playbackManager.current.stop();
		updatePlaybackState();
	};

	const seekMusic = (seekPercentage: number) => {
		playbackManager.current.seek(seekPercentage);
		adjustPolling();
	};

	// Update volume pairs when component is rendered
	// Doing so in the useState initializer causes hydration issues due to
	// playback manager only doing certain things when being ran on the client
	useEffect(updateVolumePairs, []);

	useEffect(adjustPolling, [
		playbackState,
		startPolling,
		stopPolling,
		updatePollValue,
	]);

	return {
		volumePairs,
		playbackState,
		volumeModifier,
		seekPercentage: pollValue,
		setScore,
		setImportedAudio,
		playMusic,
		stopMusic,
		seekMusic,
	};
};
