import { ButtonHTMLAttributes, FunctionComponent, ReactNode } from 'react';
import classes from './AssignerButton.module.css';

interface AssignerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
}

const AssignerButton: FunctionComponent<AssignerButtonProps> = ({
	children,
	...props
}) => {
	return <button {...props}>{children}</button>;
};

export default AssignerButton;
