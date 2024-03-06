'use client';

import ImportExportPage from '@/components/ui/import-export-test';
import classes from './index.module.css';
import { FunctionComponent, useEffect, useRef } from 'react';
import { useMusic } from '@/components/providers/music';
import VolumeManager from '@/components/ui/volume-manager';
import { PlaybackManager } from '@/utils/audio/playback';
import ImportScoreDropdown from '@/components/ui/taskbar/dropdown/import-score-dropdown';
import ImportAudioDropdown from '@/components/ui/taskbar/dropdown/import-audio-dropdown';

type ImportExportTestPageProps = {};

const ImportExportTestPage: FunctionComponent<
	ImportExportTestPageProps
> = () => {
	const playbackManager = useRef(new PlaybackManager());
	const music = useMusic();

	useEffect(() => {
		playbackManager.current.setMusicScore(music.musicScore);
	}, [music.musicScore]);

	return (
		<>
			<ImportExportPage playbackManager={playbackManager.current} />
			<VolumeManager volumeModifier={playbackManager.current} />
		</>
	);
};

export default ImportExportTestPage;
