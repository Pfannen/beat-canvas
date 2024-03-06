import { FunctionComponent, ReactNode } from 'react';
import classes from './taskbar-dropdown.module.css';
import DropdownList from '../../reusable/dropdown/dropdown-list';

interface TaskbarDropdownProps {
	title: string;
	children: ReactNode;
}

const TaskbarDropdown: FunctionComponent<TaskbarDropdownProps> = ({
	title,
	children,
}) => {
	return (
		<>
			<DropdownList
				title={title}
				className={classes.dropdown}
				selectionsClassName={classes.selections}
			>
				{children}
			</DropdownList>
		</>
	);
};

export default TaskbarDropdown;
