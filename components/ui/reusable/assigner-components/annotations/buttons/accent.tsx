import { FunctionComponent } from 'react';
import classes from './AccentAssigner.module.css';
import { INoteAnnotationAssignerButton } from '@/types/modify-score/assigner';
import ModifyMusicAssigner from '../../style/modify-music-assigner-button';
import AccentSVG from '@/components/ui/svg/annotations/accent-svg';

interface AccentAssignerProps extends INoteAnnotationAssignerButton {}

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
