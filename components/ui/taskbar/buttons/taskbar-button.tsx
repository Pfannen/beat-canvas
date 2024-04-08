import { ButtonHTMLAttributes, FunctionComponent } from 'react';
import classes from './taskbar-button.module.css';
import { concatClassNames } from '@/utils/css';

interface TaskbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const TaskbarButton: FunctionComponent<TaskbarButtonProps> = ({
	className,
	...props
}) => {
	return (
		<button
			className={concatClassNames(classes.taskbar_btn, className)}
			{...props}
		>
			{props.children}
		</button>
	);
};

export default TaskbarButton;
