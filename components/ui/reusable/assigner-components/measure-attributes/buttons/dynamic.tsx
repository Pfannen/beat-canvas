import { FunctionComponent } from 'react';
import classes from './DynamicAssigner.module.css';
import { IMeasureAssignerButton } from '@/types/modify-score/assigner';
import ModifyMusicAssigner from '../../style/modify-music-assigner-button';
import { Dynamic } from '@/types/music/note-annotations';

interface DynamicAssignerProps extends IMeasureAssignerButton {
	dynamic: Dynamic;
}

const DynamicAssigner: FunctionComponent<DynamicAssignerProps> = ({
	assigner,
	dynamic,
}) => {
	return (
		<ModifyMusicAssigner onClick={() => assigner('dynamic', dynamic)}>
			{dynamic}
		</ModifyMusicAssigner>
	);
};

export default DynamicAssigner;
