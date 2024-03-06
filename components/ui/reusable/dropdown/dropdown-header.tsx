import { FunctionComponent, ReactNode } from 'react';
import classes from './dropdown-header.module.css';
import DropdownArrow from '../../svg/dropdown-arrow';
import { concatClassNames } from '@/utils/css';

export interface DropdownHeaderProps {
	title: string;
	icon?: ReactNode;
	onClick?: () => void;
	headerClassName?: string;
}

const DropdownHeader: FunctionComponent<DropdownHeaderProps> = ({
	title,
	icon,
	onClick,
	headerClassName,
}) => {
	return (
		<div
			className={concatClassNames(classes.header, headerClassName)}
			onClick={onClick}
		>
			{icon && <div className={classes.icon}>{icon}</div>}
			<p>{title}</p>
			<DropdownArrow className={classes.icon} />
		</div>
	);
};

export default DropdownHeader;
