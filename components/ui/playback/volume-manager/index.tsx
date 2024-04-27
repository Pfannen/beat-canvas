import { FunctionComponent } from 'react';
import classes from './VolumeManager.module.css';
import { useMusic } from '@/components/providers/music';
import { IVolumeValueModifer, VolumePair } from '@/types/audio/volume';
import PlaybackSlider from '../styles/playback-slider';

export interface VolumeManagerProps {
	modifyVolume: (audioId: string, volumePct: number) => void;
	volumePairs: VolumePair[];
}

const VolumeManager: FunctionComponent<VolumeManagerProps> = ({
	modifyVolume,
	volumePairs,
}) => {
	return (
		<>
			{volumePairs.map((attributes) => (
				<div key={attributes.audioId}>
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
