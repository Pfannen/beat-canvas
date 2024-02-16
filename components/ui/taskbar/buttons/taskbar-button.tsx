import { ButtonHTMLAttributes, FunctionComponent } from 'react';
import classes from './taskbar-button.module.css';

interface TaskbarButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {}

const TaskbarButton: FunctionComponent<TaskbarButtonProps> = (props) => {
	return (
		<button className={classes.taskbar_btn} {...props}>
			{props.children}
		</button>
	);
};

export default TaskbarButton;
