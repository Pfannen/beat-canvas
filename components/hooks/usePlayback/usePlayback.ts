import { MusicPlaybackState, MusicVolumePairMap } from '@/types/audio/volume';
import { MusicScore } from '@/types/music';
/* import { PlaybackManager as BeatCanvasPlaybackManager } from '@/utils/audio/playback'; */
import { useEffect, useRef, useState } from 'react';
import { BasicPlaybackState } from 'tone';
import { usePolling } from '../usePolling';
import { MusicPlaybackManager } from '@/utils/audio/music-playback';

export const usePlayback = (initialPBM?: MusicPlaybackManager) => {
	const playbackManager = useRef<MusicPlaybackManager>(
		initialPBM || new MusicPlaybackManager()
	);

	const { pollValue, startPolling, stopPolling, updatePollValue } = usePolling(
		250,
		playbackManager.current.getOffsetPercentage
	);

	// Master volume will always exist
	const [musicVolumePairMap, setMusicVolumePairMap] =
		useState<MusicVolumePairMap>({
			master: [{ audioId: 'Master Volume', volumePercentage: 1 }],
			imported: [],
			score: [],
		});

	const [playbackState, setPlaybackState] = useState<MusicPlaybackState>(
		playbackManager.current.getMusicPlaybackState
	);

	const updatePlaybackState = () => {
		setPlaybackState(playbackManager.current.getMusicPlaybackState());
	};

	const updateVolumePairs = () => {
		const newPairMap = playbackManager.current.getMusicVolumePairs();
		setMusicVolumePairMap(newPairMap);
	};

	const adjustPolling = () => {
		if (playbackState === 'started') startPolling();
		else {
			stopPolling();
			updatePollValue();
		}
	};

	// Use this method if you want to enqueue the music score right away
	const setScore = async (score?: MusicScore) => {
		const audioUpdated = await playbackManager.current.setMusicScore(score);
		if (audioUpdated) seekMusic(0);
		updateVolumePairs();
		updatePlaybackState();
	};

	// Use this method if you want to defer enqueueing the music score
	const newScoreEncountered = (score?: MusicScore) => {
		playbackManager.current.newMusicScore(score);
		updatePlaybackState();
	};

	//TODO: have status for importing bad audio file
	const setImportedAudio = async (audioFile?: File) => {
		// Importing audio will set the state to 'enqueueing' (no good way to get this enqueueing state besides manually updating)
		setPlaybackState('enqueueing');
		await playbackManager.current.setImportedAudio(audioFile);
		updateVolumePairs();
		updatePlaybackState();
	};

	// Play the music - only need to update the volume pairs if we need to enqueue, else the pairs should be the same
	const playMusic = async () => {
		// If the manager requires enqueueing, we know the state will be 'enqueueing'
		if (
			playbackManager.current.getMusicPlaybackState() === 'requires enqueue'
		) {
			setPlaybackState('enqueueing');
			await playbackManager.current.enqueueLoadedScore();
			updateVolumePairs();
		}
		await playbackManager.current.play();
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

	useEffect(() => {
		const curState = playbackManager.current.getMusicPlaybackState();
		console.log({ curState });
		if (curState !== playbackState) {
			if (curState === 'stopped' && pollValue === 1) {
				seekMusic(0);
			}
			setPlaybackState(curState);
		}
	}, [pollValue, playbackState]);

	useEffect(adjustPolling, [
		playbackState,
		startPolling,
		stopPolling,
		updatePollValue,
	]);

	return {
		musicVolumePairMap,
		playbackState,
		playbackManager: playbackManager.current,
		seekPercentage: pollValue,
		setScore,
		newScoreEncountered,
		setImportedAudio,
		playMusic,
		stopMusic,
		seekMusic,
	};
};
