import { FunctionComponent, useEffect, useRef, useState } from 'react';
import classes from './PlaybackVolumeManagerSwapper.module.css';
import { Selection } from '@/components/hooks/useSelection';
import { MusicPlaybackManager } from '@/utils/audio/music-playback';
import MusicScorePlaybackVolumeManager from './music-score-playback-volume-manager';
import LoopPlaybackManager from './loop-playback/loop-playback-manager';

interface PlaybackVolumeManagerSwapperProps {
	setImportedAudioLifter?: (setImportedAudioDel: () => void) => void;
	setSelectedMeasuresLifter?: (
		setSelectedMeasuresDel: (selection?: Selection) => void
	) => void;
}

const PlaybackVolumeManagerSwapper: FunctionComponent<
	PlaybackVolumeManagerSwapperProps
> = ({ setImportedAudioLifter, setSelectedMeasuresLifter }) => {
    // Create a singleton playback manager - it will be used for both standard playback and looping
	const singletonPBMRef = useRef<MusicPlaybackManager>(
		new MusicPlaybackManager()
	);

	const [selectedMeasures, setSelectedMeasures] = useState<Selection | null>(
		null
	);

	if (setSelectedMeasuresLifter) {
		setSelectedMeasuresLifter((selection) => {
			if (selection !== selectedMeasures)
				setSelectedMeasures(selection || null);
		});
	}

	if (!selectedMeasures) {
		return (
			<>
				<MusicScorePlaybackVolumeManager
					setImportedAudioLifter={setImportedAudioLifter}
					initialPBM={singletonPBMRef.current}
				/>
			</>
		);
	} else {
		const { start, end } = selectedMeasures;
		return (
			<>
				<LoopPlaybackManager
					sourcePlaybackManager={singletonPBMRef.current!}
					start={start}
					end={end}
				/>
			</>
		);
	}
};

export default PlaybackVolumeManagerSwapper;
