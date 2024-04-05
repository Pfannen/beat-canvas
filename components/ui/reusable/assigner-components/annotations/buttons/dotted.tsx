import { FunctionComponent } from 'react';
import classes from './DottedAssigner.module.css';
import { INoteAssignerButton } from '@/types/modify-score';
import ModifyMusicAssigner from '../../modify-music-assigner-button';
import AccentSVG from '@/components/ui/svg/annotations/accent-svg';
import DottedSVG from '@/components/ui/svg/annotations/dotted-svg';

interface DottedAssignerProps extends INoteAssignerButton {}

const DottedAssigner: FunctionComponent<DottedAssignerProps> = ({
	active,
	assigner,
	annotations,
}) => {
	return (
		<ModifyMusicAssigner
			onClick={() => assigner('dotted', true)}
			active={active}
		>
			<DottedSVG />
		</ModifyMusicAssigner>
	);
};

export default DottedAssigner;
