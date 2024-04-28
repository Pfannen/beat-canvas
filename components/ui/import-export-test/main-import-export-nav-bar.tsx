import { FunctionComponent, MutableRefObject, Ref, useEffect } from 'react';
import classes from './MainImportExportNavBar.module.css';
import { useMusic } from '@/components/providers/music';
import ImportExportPage from '.';
import { MusicScore } from '@/types/music';

interface MainImportExportNavBarProps {
	setImportedAudio?: (audioFile: File) => void;
	setImportedAudioRef?: MutableRefObject<(file: File) => void>;
	setScore?: (musicScore?: MusicScore) => void;
}

const MainImportExportNavBar: FunctionComponent<
	MainImportExportNavBarProps
> = ({ setImportedAudio = () => {}, setScore, setImportedAudioRef }) => {
	const {
		scoreItems: { replaceMusicScore, musicScore },
	} = useMusic();

	const setImportedAudioLocal = (file: File) => {
		if (setImportedAudioRef) setImportedAudioRef.current(file);
		else setImportedAudio(file);
	};

	return (
		<ImportExportPage
			setScore={(s) => {
				replaceMusicScore(s);
				setScore && setScore(s);
			}}
			setImportedAudio={setImportedAudioLocal}
			musicScore={musicScore}
		/>
	);
};

export default MainImportExportNavBar;
