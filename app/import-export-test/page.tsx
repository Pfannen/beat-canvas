'use client';

import ImportExportPage from '@/components/ui/import-export-test';
import classes from './index.module.css';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useMusic } from '@/components/providers/music';
import VolumeManager from '@/components/ui/volume-manager';
import { PlaybackManager } from '@/utils/audio/playback';
import { VolumePairs } from '@/types/audio/volume';

type ImportExportTestPageProps = {};

const ImportExportTestPage: FunctionComponent<
	ImportExportTestPageProps
> = () => {
	const [volumePairs, setVolumePairs] = useState<VolumePairs>([]);
	const playbackManager = useRef(new PlaybackManager());
	const music = useMusic();

	useEffect(() => {
		playbackManager.current.setMusicScore(music.musicScore);
		setVolumePairs(playbackManager.current.getVolumePairs());
	}, [music.musicScore]);

	return (
		<>
			<ImportExportPage playbackManager={playbackManager.current} />
			<VolumeManager
				volumePairs={volumePairs}
				modifyVolume={playbackManager.current.modifyVolume}
			/>
		</>
	);
};

export default ImportExportTestPage;
