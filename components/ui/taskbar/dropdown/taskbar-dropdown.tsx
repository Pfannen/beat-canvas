import { FunctionComponent, ReactNode } from 'react';
import classes from './taskbar-dropdown.module.css';
import DropdownList from '../../reusable/dropdown/dropdown-list';

interface TaskbarDropdownProps {
	title: string;
	children: ReactNode;
	headerIcon?: ReactNode;
}

const TaskbarDropdown: FunctionComponent<TaskbarDropdownProps> = ({
	title,
	children,
	headerIcon,
}) => {
	return (
		<>
			<DropdownList
				title={title}
				className={classes.dropdown}
				selectionsClassName={classes.selections}
				headerClassName={classes.header}
				headerIcon={headerIcon}
			>
				{children}
			</DropdownList>
		</>
	);
};

export default TaskbarDropdown;
