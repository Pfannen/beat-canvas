import { FunctionComponent } from 'react';
import classes from './VolumeManager.module.css';
import { VolumePair } from '@/types/audio/volume';
import PlaybackSlider from '../styles/playback-slider';

export interface VolumeManagerProps {
	modifyVolume: (audioId: string, volumePct: number) => void;
	volumePairs: VolumePair[];
	volumeItemClassName?: string;
}

const VolumeManager: FunctionComponent<VolumeManagerProps> = ({
	modifyVolume,
	volumePairs,
	volumeItemClassName = '',
}) => {
	return (
		<>
			{volumePairs.map((attributes) => (
				<div key={attributes.audioId} className={volumeItemClassName}>
					<p>{attributes.audioId}</p>
					<PlaybackSlider
						onChange={(event) => {
							modifyVolume(attributes.audioId, +event.target.value / 100);
						}}
						defaultValue={attributes.volumePercentage * 100}
						style={{ display: 'block' }}
					/>
				</div>
			))}
		</>
	);
};

export default VolumeManager;
