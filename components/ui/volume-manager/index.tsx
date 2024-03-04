import { FunctionComponent } from 'react';
import classes from './VolumeManager.module.css';
import { useMusic } from '@/components/providers/music';
import { IVolumeValueModifer } from '@/types/audio/volume';

interface VolumeManagerProps {
	volumeModifier: IVolumeValueModifer;
}

const VolumeManager: FunctionComponent<VolumeManagerProps> = ({
	volumeModifier,
}) => {
	const { getPartAttributes } = useMusic();

	return (
		<>
			<p>Master</p>
			<input
				type="range"
				onChange={(event) => {
					volumeModifier.modifyVolume('master', +event.target.value / 100);
				}}
				defaultValue={50}
				style={{ display: 'block' }}
			/>
			{getPartAttributes().map((attributes) => (
				<div key={attributes.id}>
					<p>{attributes.name}</p>
					<input
						type="range"
						onChange={(event) => {
							volumeModifier.modifyVolume(
								attributes.id,
								+event.target.value / 100
							);
						}}
						defaultValue={50}
						style={{ display: 'block' }}
					/>
				</div>
			))}
			<p>Player</p>
			<input
				type="range"
				onChange={(event) => {
					volumeModifier.modifyVolume('player', +event.target.value / 100);
				}}
				defaultValue={50}
				style={{ display: 'block' }}
			/>
		</>
	);
};

export default VolumeManager;
