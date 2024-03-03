import { FunctionComponent } from 'react';
import classes from './VolumeManager.module.css';
import { useMusic } from '@/components/providers/music';
import { ScoreVolumeManager } from '@/utils/audio/volume';

interface VolumeManagerProps {}

const VolumeManager: FunctionComponent<VolumeManagerProps> = () => {
	const { getPartAttributes } = useMusic();

	return (
		<>
			<p>Master</p>
			<input
				type="range"
				onChange={(event) => {
					ScoreVolumeManager.modifyVolume('master', +event.target.value / 100);
				}}
				defaultValue={ScoreVolumeManager.defaultVolumePct * 100}
				style={{ display: 'block' }}
			/>
			{getPartAttributes().map((attributes) => (
				<div key={attributes.id}>
					<p>{attributes.name}</p>
					<input
						type="range"
						onChange={(event) => {
							ScoreVolumeManager.modifyVolume(
								attributes.id,
								+event.target.value / 100
							);
						}}
						defaultValue={ScoreVolumeManager.defaultVolumePct * 100}
						style={{ display: 'block' }}
					/>
				</div>
			))}
		</>
	);
};

export default VolumeManager;
