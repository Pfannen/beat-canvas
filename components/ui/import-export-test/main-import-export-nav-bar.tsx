import { FunctionComponent, useEffect } from 'react';
import classes from './MainImportExportNavBar.module.css';
import { useMusic } from '@/components/providers/music';
import ImportExportPage from '.';
import { MusicScore } from '@/types/music';

interface MainImportExportNavBarProps {
	setImportedAudio: (audioFile: File) => void;
	setScore?: (musicScore?: MusicScore) => void;
}

const MainImportExportNavBar: FunctionComponent<
	MainImportExportNavBarProps
> = ({ setImportedAudio, setScore }) => {
	const { setNewMusicScore, musicScore } = useMusic();

	return (
		<ImportExportPage
			setScore={(s) => {
				setNewMusicScore(s);
				setScore && setScore(s);
			}}
			setImportedAudio={setImportedAudio}
			musicScore={musicScore}
		/>
	);
};

export default MainImportExportNavBar;
