import {
	FunctionComponent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import classes from './playback-volume-manager-swapper.module.css';
import { Selection } from '@/components/hooks/useSelection';
import { MusicPlaybackManager } from '@/utils/audio/music-playback';
import MusicScorePlaybackVolumeManager from './music-score-playback-volume-manager';
import LoopPlaybackManager from './loop-playback/loop-playback-manager';
import { selectionsAreEqual } from '@/utils/music/is-equal-helpers';
import { useGlobalWorkspace } from '@/components/providers/workspace';

interface PlaybackVolumeManagerSwapperProps {
	setImportedAudioLifter?: (setImportedAudioDel: () => void) => void;
	getAudioBufferLifter?: (del: () => Promise<AudioBuffer | null>) => void;
}

const PlaybackVolumeManagerSwapper: FunctionComponent<
	PlaybackVolumeManagerSwapperProps
> = ({ setImportedAudioLifter, getAudioBufferLifter }) => {
	const ws = useGlobalWorkspace();

	// Create a singleton playback manager - it will be used for both standard playback and looping
	const singletonPBMRef = useRef<MusicPlaybackManager>(
		new MusicPlaybackManager()
	);

	const [selectedMeasures, setSelectedMeasures] = useState<Selection | null>(
		null
	);

	useEffect(() => {
		const mode = ws.mode.get();
		// If the mode is loop
		if (mode === 'loop') {
			// If we already have selected measures (because the mode has been loop), do nothing
			if (selectedMeasures) return;
			// Else the mode was changed and we need to update the state
			setSelectedMeasures(ws.getSelectedMeasures() || null);
		} else {
			// If the selected measures aren't null (because we just switched out of loop mode), set them to be null
			if (selectedMeasures !== null) {
				const { start, end } = selectedMeasures;
				ws.onMeasureClick(start);
				ws.onMeasureClick(end);
				setSelectedMeasures(null);
			}
		}
	}, [ws, ws.mode, selectedMeasures]);

	useEffect(() => {
		if (getAudioBufferLifter) {
			getAudioBufferLifter(singletonPBMRef.current.getMergedAudioBufffer);
		}
	}, [getAudioBufferLifter]);

	const playedMeasureUpdated = useCallback(
		(measureIdx: number | null) => {
			const mode = ws.mode.get();
			if (mode !== 'loop' && mode !== 'playback') return;

			const selection = ws.getSelectedMeasures();
			if (measureIdx === null) {
				if (selection) ws.clearSelection();
			} else if (!selection || selection.start !== measureIdx) {
				ws.setSingleSelection(measureIdx);
			}
		},
		[ws]
	);

	const onStop = useCallback(() => {
		ws.clearSelection();
		ws.mode.clear();
		console.log('stop');
	}, [ws]);

	return (
		<>
			{!selectedMeasures && (
				<div className={classes.managers_container}>
					<MusicScorePlaybackVolumeManager
						setImportedAudioLifter={setImportedAudioLifter}
						initialPBM={singletonPBMRef.current}
						onPlay={() => ws.mode.set('playback')}
						onStop={onStop}
						playedMeasureUpdated={playedMeasureUpdated}
					/>
				</div>
			)}
			{selectedMeasures && (
				<div className={classes.managers_container}>
					<LoopPlaybackManager
						sourcePlaybackManager={singletonPBMRef.current!}
						start={selectedMeasures.start}
						end={selectedMeasures.end}
						playedMeasureUpdated={playedMeasureUpdated}
					/>
				</div>
			)}
		</>
	);
};

export default PlaybackVolumeManagerSwapper;
