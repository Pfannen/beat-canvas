import { FunctionComponent, ReactNode, SVGProps } from 'react';
import classes from './modify-music-assigner.module.css';
import AssignerButton from '.';
import { concatClassNames } from '@/utils/css';

interface ModifyMusicAssignerProps {
	onClick: () => void;
	children: FunctionComponent<SVGProps<SVGSVGElement>>;
	active?: boolean;
}

const ModifyMusicAssigner: FunctionComponent<ModifyMusicAssignerProps> = ({
	onClick,
	active,
	children: Children,
}) => {
	return (
		<AssignerButton
			className={concatClassNames(classes.btn, !active && classes.inactive)}
			onClick={onClick}
		>
			{<Children fill="#012345" />}
		</AssignerButton>
	);
};

export default ModifyMusicAssigner;
