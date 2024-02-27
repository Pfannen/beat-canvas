'use client';

import ImportExportPage from '@/components/ui/import-export-test';
import classes from './index.module.css';
import { FunctionComponent } from 'react';
import { useMusic } from '@/components/providers/music';
import { ScoreVolumeManager } from '@/utils/audio/ScoreVolumeManager';

type ImportExportTestPageProps = {};

const ImportExportTestPage: FunctionComponent<
	ImportExportTestPageProps
> = () => {
	return (
		<>
			<ImportExportPage />
			<input
				type="range"
				onChange={(event) => {
					ScoreVolumeManager.modifyVolume('master', +event.target.value / 100);
				}}
				style={{ display: 'block' }}
			/>
			<input
				type="range"
				onChange={(event) => {
					ScoreVolumeManager.modifyVolume('P1', +event.target.value / 100);
				}}
				style={{ display: 'block' }}
			/>
		</>
	);
};

export default ImportExportTestPage;
