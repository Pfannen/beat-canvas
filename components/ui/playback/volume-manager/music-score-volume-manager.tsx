import { FunctionComponent } from 'react';
import classes from './music-score-volume-manager.module.css';
import VolumeManager, { VolumeManagerProps } from '.';
import { MusicVolumePairMap } from '@/types/audio/volume';

export interface MusicScoreVolumeManagerProps {
	musicVolumePairs: MusicVolumePairMap;
	modifyVolume: (audioId: string, volumePct: number) => void;
}

const MusicScoreVolumeManager: FunctionComponent<
	MusicScoreVolumeManagerProps
> = ({ musicVolumePairs, modifyVolume }) => {
	const { master, imported, score } = musicVolumePairs;

	return (
		<div className={classes.volume_manager_container}>
			{master.length && (
				<div className={classes.pair_container}>
					<VolumeManager
						modifyVolume={modifyVolume}
						volumePairs={musicVolumePairs.master}
						volumeItemClassName={classes.volume_pair}
					/>
				</div>
			)}
			{imported.length ? (
				<div className={classes.pair_container}>
					<VolumeManager
						modifyVolume={modifyVolume}
						volumePairs={imported}
						volumeItemClassName={classes.volume_pair}
					/>
				</div>
			) : (
				''
			)}
			{score.length ? (
				<div className={classes.pair_container}>
					<VolumeManager
						modifyVolume={modifyVolume}
						volumePairs={score}
						volumeItemClassName={classes.volume_pair}
					/>
				</div>
			) : (
				''
			)}
		</div>
	);
};

export default MusicScoreVolumeManager;
