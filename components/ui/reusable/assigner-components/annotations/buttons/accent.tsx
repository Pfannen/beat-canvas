import { FunctionComponent } from 'react';
import classes from './AccentAssigner.module.css';
import { INoteAssignerButton } from '@/types/modify-score';
import ModifyMusicAssigner from '../../modify-music-assigner-button';
import AccentSVG from '@/components/ui/svg/annotations/accent-svg';

interface AccentAssignerProps extends INoteAssignerButton {}

const AccentAssigner: FunctionComponent<AccentAssignerProps> = ({
	active,
	assigner,
	annotations,
}) => {
	return (
		<ModifyMusicAssigner
			onClick={() => assigner('accent', 'strong')}
			active={active}
		>
			<AccentSVG />
		</ModifyMusicAssigner>
	);
};

export default AccentAssigner;
