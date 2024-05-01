import { FunctionComponent, useEffect, useRef, useState } from 'react';
import classes from './playback-volume-manager-swapper.module.css';
import { Selection } from '@/components/hooks/useSelection';
import { MusicPlaybackManager } from '@/utils/audio/music-playback';
import MusicScorePlaybackVolumeManager from './music-score-playback-volume-manager';
import LoopPlaybackManager from './loop-playback/loop-playback-manager';
import { selectionsAreEqual } from '@/utils/music/is-equal-helpers';

interface PlaybackVolumeManagerSwapperProps {
	setImportedAudioLifter?: (setImportedAudioDel: () => void) => void;
	setSelectedMeasuresLifter?: (
		setSelectedMeasuresDel: (selection?: Selection) => void
	) => void;
	getAudioBufferLifter?: (del: () => Promise<AudioBuffer | null>) => void;
}

const PlaybackVolumeManagerSwapper: FunctionComponent<
	PlaybackVolumeManagerSwapperProps
> = ({
	setImportedAudioLifter,
	setSelectedMeasuresLifter,
	getAudioBufferLifter,
}) => {
	// Create a singleton playback manager - it will be used for both standard playback and looping
	const singletonPBMRef = useRef<MusicPlaybackManager>(
		new MusicPlaybackManager()
	);
	// const stopLoopingRef = useRef<() => void>(() => { console.log('dis one');});

	const [selectedMeasures, setSelectedMeasures] = useState<Selection | null>(
		null
	);

	useEffect(() => {
		if (!setSelectedMeasuresLifter) return;

		// Before the looped PBM is opened, we need to make sure the latest score is up-to-date
		setSelectedMeasuresLifter(async (selection) => {
			if (!selection) {
				if (selectedMeasures !== null) setSelectedMeasures(null);
			} else {
				if (selectionsAreEqual(selection, selectedMeasures || undefined))
					return;

				// if (stopLoopingRef.current) stopLoopingRef.current();
				await singletonPBMRef.current.enqueueLoadedScore();
				setSelectedMeasures(selection);
			}
		});
	}, [selectedMeasures, setSelectedMeasures, setSelectedMeasuresLifter]);

	useEffect(() => {
		if (getAudioBufferLifter) {
			getAudioBufferLifter(singletonPBMRef.current.getMergedAudioBufffer);
		}
	}, [getAudioBufferLifter]);

	// If we don't have measures selected, we render the standard PBM

	return (
		<>
			{!selectedMeasures && (
				<div className={classes.managers_container}>
					<MusicScorePlaybackVolumeManager
						setImportedAudioLifter={setImportedAudioLifter}
						initialPBM={singletonPBMRef.current}
					/>
				</div>
			)}
			{selectedMeasures && (
				<div className={classes.managers_container}>
					<LoopPlaybackManager
						sourcePlaybackManager={singletonPBMRef.current!}
						start={selectedMeasures.start}
						end={selectedMeasures.end}
						// stopLoopingRef={stopLoopingRef}
					/>
				</div>
			)}
		</>
	);
};

export default PlaybackVolumeManagerSwapper;
