import { FunctionComponent } from 'react';
import classes from './QuarterNoteAssigner.module.css';
import AccentSVG from '@/components/ui/svg/annotations/accent-svg';
import { INotePlacementAssignerButton } from '@/types/modify-score/assigner';
import ModifyMusicAssigner from '../../modify-music-assigner-button';

interface NotePlacementAssignerProps extends INotePlacementAssignerButton {}

const NotePlacementAssigner: FunctionComponent<NotePlacementAssignerProps> = ({
	assigner,
	noteType,
	children,
}) => {
	return (
		<ModifyMusicAssigner onClick={assigner.bind(null, noteType)}>
			{children}
		</ModifyMusicAssigner>
	);
};

export default NotePlacementAssigner;
