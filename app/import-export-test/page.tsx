'use client';

import ImportExportPage from '@/components/ui/import-export-test';
import classes from './index.module.css';
import { FunctionComponent } from 'react';
import { useMusic } from '@/components/providers/music';
import { ScoreVolumeManager } from '@/utils/audio/volume';
import MusicProvider from '@/components/providers/music';
import VolumeManager from '@/components/ui/volume-manager';

type ImportExportTestPageProps = {};

const ImportExportTestPage: FunctionComponent<
	ImportExportTestPageProps
> = () => {
	return (
		<MusicProvider>
			<ImportExportPage />
			<VolumeManager />
		</MusicProvider>
	);
};

export default ImportExportTestPage;
