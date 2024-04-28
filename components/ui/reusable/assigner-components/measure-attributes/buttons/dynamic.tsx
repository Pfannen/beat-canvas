import { FunctionComponent } from 'react';
import classes from './DynamicAssigner.module.css';
import { IKnownGenericAssignerComponent } from '@/types/modify-score/assigner';
import ModifyMusicAssigner from '../../style/modify-music-assigner-button';
import { Dynamic } from '@/types/music/note-annotations';
import { getAssignValue } from '@/utils/music/modify-score/metadata-helpers';
import { MeasureAttributes } from '@/types/music';

interface DynamicAssignerProps
	extends IKnownGenericAssignerComponent<MeasureAttributes, 'dynamic'> {
	dynamic: Dynamic;
}

const DynamicAssigner: FunctionComponent<DynamicAssignerProps> = ({
	assigner,
	dynamic,
	metadataEntry,
}) => {
	const assignValue = getAssignValue<MeasureAttributes, 'dynamic'>(
		'pp',
		metadataEntry
	);

	return (
		<ModifyMusicAssigner
			onClick={() => assigner('dynamic', assignValue && dynamic)}
			disabled={!metadataEntry}
			add={!!assignValue}
		>
			{dynamic}
		</ModifyMusicAssigner>
	);
};

export default DynamicAssigner;
