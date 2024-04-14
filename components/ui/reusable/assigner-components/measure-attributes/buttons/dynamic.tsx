import { FunctionComponent } from 'react';
import classes from './DynamicAssigner.module.css';
import { IAttributeAssignerComponent } from '@/types/modify-score/assigner';
import ModifyMusicAssigner from '../../style/modify-music-assigner-button';
import { Dynamic } from '@/types/music/note-annotations';
import { getAssignValue } from '@/utils/music/modify-score/assigner';
import { MeasureAttributes } from '@/types/music';

interface DynamicAssignerProps extends IAttributeAssignerComponent<'dynamic'> {
	dynamic: Dynamic;
}

const DynamicAssigner: FunctionComponent<DynamicAssignerProps> = ({
	assigner,
	dynamic,
	attributeMetadata,
}) => {
	const assignValue = getAssignValue<MeasureAttributes, 'dynamic'>(
		attributeMetadata
	);

	return (
		<ModifyMusicAssigner
			onClick={() => assigner('dynamic', assignValue && dynamic)}
			disabled={!attributeMetadata}
		>
			{dynamic}
		</ModifyMusicAssigner>
	);
};

export default DynamicAssigner;
