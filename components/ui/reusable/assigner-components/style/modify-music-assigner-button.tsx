import { FunctionComponent, ReactNode, SVGProps } from 'react';
import classes from './modify-music-assigner-button.module.css';
import AssignerButton from '../assigner-button';
import { concatClassNames } from '@/utils/css';
import { IMusicAssignerComponent } from '@/types/modify-score/assigner';

interface ModifyMusicAssignerProps extends IMusicAssignerComponent {
	children: ReactNode;
	onClick?: () => void;
}

const ModifyMusicAssigner: FunctionComponent<ModifyMusicAssignerProps> = ({
	children,
	onClick,
	disabled,
	add,
}) => {
	return (
		<AssignerButton
			className={concatClassNames(
				classes.btn,
				add ? classes.add : classes.delete
			)}
			onClick={onClick}
			disabled={!!disabled}
		>
			{children}
		</AssignerButton>
	);
};

export default ModifyMusicAssigner;
