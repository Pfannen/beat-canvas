'use client';

import ImportExportPage from '@/components/ui/import-export-test';
import { FunctionComponent } from 'react';
import { useMusic } from '@/components/providers/music';
import VolumeManager from '@/components/ui/volume-manager';
import { usePlayback } from '@/components/hooks/usePlayback/usePlayback';
import AssignerButtonRepo from '@/components/ui/reusable/assigner-components/assigner-button-repo';
import { stacklessNotePlacementValidator } from '@/utils/music/note-placement';

type ImportExportTestPageProps = {};

const ImportExportTestPage: FunctionComponent<
	ImportExportTestPageProps
> = () => {
	const { setScore, setImportedAudio, playMusic, volumeModifier, volumePairs } =
		usePlayback();
	const { musicScore, setNewMusicScore, replaceMeasures } = useMusic();

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
				selections={[]}
				notePlacementValidator={stacklessNotePlacementValidator}
			/>
		</>
	);
};

export default ImportExportTestPage;
