import { FunctionComponent, useRef } from 'react';
import TaskbarDropdown from './taskbar-dropdown';
import MP3SVG from '../../svg/mp3';
import MusicFolderSVG from '../../svg/music-folder-svg';

interface ImportAudioDropdownProps {
	setImportedAudio: (audio: File) => void;
}

const ImportAudioDropdown: FunctionComponent<ImportAudioDropdownProps> = ({
	setImportedAudio,
}) => {
	const mp3InputRef = useRef<HTMLInputElement>(null);

	return (
		<TaskbarDropdown title="Import Audio" headerIcon={<MusicFolderSVG />}>
			<button
				onClick={() => {
					if (mp3InputRef.current) mp3InputRef.current.click();
				}}
			>
				<input
					type="file"
					accept=".mp3"
					style={{ display: 'none' }}
					ref={mp3InputRef}
					onChange={() => {
						if (!mp3InputRef.current || !mp3InputRef.current.files) return;

						const file = mp3InputRef.current.files[0];
						setImportedAudio(file);
					}}
				/>
				<p>MP3</p>
				<MP3SVG />
			</button>
		</TaskbarDropdown>
	);
};

export default ImportAudioDropdown;
