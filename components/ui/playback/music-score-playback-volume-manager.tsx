import { FunctionComponent, useEffect } from 'react';
import classes from './MusicScorePlaybackVolumeManager.module.css';
import { usePlayback } from '@/components/hooks/usePlayback/usePlayback';
import { useMusic } from '@/components/providers/music';
import PlaybackVolumeManager from './playback-volume-manager';

interface MusicScorePlaybackVolumeManagerProps {
	setImportedAudioLifter?: (setImportedAudioDel: () => void) => void;
}

const MusicScorePlaybackVolumeManager: FunctionComponent<
	MusicScorePlaybackVolumeManagerProps
> = ({ setImportedAudioLifter }) => {
	const {
		setScore,
		setImportedAudio,
		playMusic,
		stopMusic,
		seekMusic,
		playbackManager,
		volumePairs,
		playbackState,
		seekPercentage,
	} = usePlayback();
	const {
		scoreItems: { musicScore },
	} = useMusic();

	useEffect(() => {
		console.log('Music score changed!');
	}, [musicScore]);

	if (setImportedAudioLifter) setImportedAudioLifter(setImportedAudio);

	return (
		<PlaybackVolumeManager
			volumePairs={volumePairs}
			modifyVolume={playbackManager.modifyVolume}
			onPlay={async () => {
				await setScore(musicScore);
				playMusic();
			}}
			onStop={stopMusic}
			onSeek={seekMusic}
			playbackState={playbackState}
			seekPercentage={seekPercentage}
			title={musicScore.title}
		/>
	);
};

export default MusicScorePlaybackVolumeManager;
