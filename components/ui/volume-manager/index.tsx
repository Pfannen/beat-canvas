import { FunctionComponent } from 'react';
import classes from './VolumeManager.module.css';
import { useMusic } from '@/components/providers/music';
import { IVolumeValueModifer, VolumePairs } from '@/types/audio/volume';

interface VolumeManagerProps {
	modifyVolume: (audioId: string, volumePct: number) => void;
	volumePairs: VolumePairs;
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
					<input
						type="range"
						onChange={(event) => {
							modifyVolume(attributes.audioId, +event.target.value / 100);
						}}
						defaultValue={50}
						style={{ display: 'block' }}
					/>
				</div>
			))}
		</>
	);
};

export default VolumeManager;
