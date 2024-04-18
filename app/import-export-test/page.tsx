'use client';

import ImportExportPage from '@/components/ui/import-export-test';
import { FunctionComponent } from 'react';
import { useMusic } from '@/components/providers/music';
import VolumeManager from '@/components/ui/playback/volume-manager';
import { usePlayback } from '@/components/hooks/usePlayback/usePlayback';
import AssignerButtonRepo from '@/components/ui/reusable/assigner-components/assigner-button-repo';
import { stacklessNotePlacementValidator } from '@/utils/music/note-placement';
import { SelectionData } from '@/types/modify-score/assigner';
import { initializeMeasureAttributes } from '@/utils/music/measures/measure-generator';
import PlaybackManager from '@/components/ui/playback/playback-manager';

type ImportExportTestPageProps = {};

const ImportExportTestPage: FunctionComponent<
	ImportExportTestPageProps
> = () => {
	const {
		setScore,
		setImportedAudio,
		playMusic,
		stopMusic,
		seekMusic,
		volumeModifier,
		volumePairs,
		playbackState,
		seekPercentage,
	} = usePlayback();
	const { musicScore, setNewMusicScore, replaceMeasures } = useMusic();

	const testSelection: SelectionData[] = [
		{
			measureIndex: 0,
			measureNotes: [],
			xStart: 0,
			xEnd: 0.75,
			y: 0,
			rollingAttributes: initializeMeasureAttributes({ notes: [] }),
			nonRollingAttributes: {},
		},
		{
			measureIndex: 0,
			measureNotes: [],
			xStart: 0.5,
			xEnd: 0.75,
			y: 0,
			rollingAttributes: initializeMeasureAttributes({ notes: [] }),
			nonRollingAttributes: {},
		},
	];

	return (
		<>
			<ImportExportPage
				setScore={(score) => {
					setScore(score);
					setNewMusicScore(score);
				}}
				setImportedAudio={setImportedAudio}
				play={playMusic}
				musicScore={musicScore}
			/>
			<VolumeManager
				volumePairs={volumePairs}
				modifyVolume={volumeModifier.modifyVolume}
			/>
			<AssignerButtonRepo
				selections={testSelection}
				notePlacementValidator={stacklessNotePlacementValidator}
				liftExecutor={() => {}}
			/>
			<PlaybackManager
				onPlay={playMusic}
				onStop={stopMusic}
				onSeek={seekMusic}
				seekPercentage={seekPercentage}
				playbackState={playbackState}
			/>
		</>
	);
};

export default ImportExportTestPage;
