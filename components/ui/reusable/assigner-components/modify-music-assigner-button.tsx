import { FunctionComponent, ReactNode, SVGProps } from 'react';
import classes from './modify-music-assigner-button.module.css';
import AssignerButton from './assigner-button';
import { concatClassNames } from '@/utils/css';

interface ModifyMusicAssignerProps {
	children: ReactNode;
	onClick?: () => void;
	active?: boolean;
}

const ModifyMusicAssigner: FunctionComponent<ModifyMusicAssignerProps> = ({
	children,
	active,
	onClick,
}) => {
	return (
		<AssignerButton
			className={concatClassNames(classes.btn, !active && classes.inactive)}
			onClick={onClick}
		>
			{children}
		</AssignerButton>
	);
};

export default ModifyMusicAssigner;
