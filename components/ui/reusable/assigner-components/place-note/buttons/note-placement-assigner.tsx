import { FunctionComponent } from 'react';
import classes from './QuarterNoteAssigner.module.css';
import { INotePlacementAssignerComponent } from '@/types/modify-score/assigner';
import ModifyMusicAssigner from '../../style/modify-music-assigner-button';

interface NotePlacementAssignerProps extends INotePlacementAssignerComponent {
	className?: string;
}

const NotePlacementAssigner: FunctionComponent<NotePlacementAssignerProps> = ({
	assigner,
	noteType,
	children,
	disabled,
}) => {
	return (
		<ModifyMusicAssigner
			onClick={
				!disabled
					? assigner.bind(null, noteType || 'quarter', !!noteType)
					: undefined
			}
			disabled={disabled}
			add={!!noteType}
		>
			{children}
		</ModifyMusicAssigner>
	);
};

export default NotePlacementAssigner;
