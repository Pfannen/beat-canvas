import { IVolumeValueModifer, VolumePair } from '@/types/audio/volume';
import { MusicScore } from '@/types/music';
import { PlaybackManager } from '@/utils/audio/playback';
import { VolumeManager } from '@/utils/audio/volume';
import { useEffect, useRef, useState } from 'react';

export const usePlayback = () => {
	const playbackManager = useRef<PlaybackManager>(new PlaybackManager());
	const volumeModifier = playbackManager.current as IVolumeValueModifer;
	const [volumePairs, setVolumePairs] = useState<VolumePair[]>([]);

	const updateVolumePairs = () => {
		const newVolumePairs = playbackManager.current.getVolumePairs();
		setVolumePairs(newVolumePairs);
	};

	const setScore = (score: MusicScore) => {
		playbackManager.current.setMusicScore(score);
		updateVolumePairs();
	};

	//TODO: have status for importing bad audio file
	const setImportedAudio = (audioFile?: File) => {
		playbackManager.current.setImportedAudio(audioFile, updateVolumePairs);
	};

	// Update volume pairs when component is rendered
	// Doing so in the useState initializer causes hydration issues due to 
	// playback manager only doing certain things when being ran on the client
	useEffect(updateVolumePairs, []);

	return {
		volumePairs,
		setScore,
		setImportedAudio,
		playbackManager: playbackManager.current,
		volumeModifier,
	};
};
