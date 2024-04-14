'use client';

import ImportExportPage from '@/components/ui/import-export-test';
import { FunctionComponent } from 'react';
import { useMusic } from '@/components/providers/music';
import VolumeManager from '@/components/ui/volume-manager';
import { usePlayback } from '@/components/hooks/usePlayback/usePlayback';
import AssignerButtonRepo from '@/components/ui/reusable/assigner-components/assigner-button-repo';
import { stacklessNotePlacementValidator } from '@/utils/music/note-placement';
import { SelectionData } from '@/types/modify-score/assigner';
import { initializeMeasureAttributes } from '@/utils/music/measures/measure-generator';

type ImportExportTestPageProps = {};

const ImportExportTestPage: FunctionComponent<
	ImportExportTestPageProps
> = () => {
	const { setScore, setImportedAudio, playMusic, volumeModifier, volumePairs } =
		usePlayback();
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
			/>
			<VolumeManager
				volumePairs={volumePairs}
				modifyVolume={volumeModifier.modifyVolume}
			/>
			<AssignerButtonRepo
				selections={testSelection}
				notePlacementValidator={stacklessNotePlacementValidator}
			/>
		</>
	);
};

export default ImportExportTestPage;
