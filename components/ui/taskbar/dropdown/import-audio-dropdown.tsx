import { FunctionComponent, useRef } from 'react';
import classes from './ImportAudioDropdown.module.css';
import TaskbarDropdown from './taskbar-dropdown';
import JSONBracesSVG from '../../svg/json-braces';
import { PlaybackManager } from '@/utils/audio/playback';
import MP3SVG from '../../svg/mp3';

interface ImportAudioDropdownProps {
	playbackManager: PlaybackManager;
}

const ImportAudioDropdown: FunctionComponent<ImportAudioDropdownProps> = ({
	playbackManager,
}) => {
	const mp3InputRef = useRef<HTMLInputElement>(null);

	return (
		<TaskbarDropdown title="Import Audio">
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
						playbackManager.setImportedAudio(file, (success) =>
							console.log('Imported audio: ' + success)
						);
					}}
				/>
				<p>mp3</p>
				<MP3SVG />
			</button>
		</TaskbarDropdown>
	);
};

export default ImportAudioDropdown;
