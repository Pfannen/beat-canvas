import { FunctionComponent, HTMLAttributes, ReactNode } from 'react';
import classes from './assigner-input-layout.module.css';
import { concatClassNames } from '@/utils/css';

interface AssignerInputLayoutProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	disabled?: boolean;
	add?: boolean;
}

const AssignerInputLayout: FunctionComponent<AssignerInputLayoutProps> = ({
	children,
	className,
	disabled,
	...props
}) => {
	return (
		<div
			className={concatClassNames(
				className,
				classes.assigner_container,
				disabled ? classes.disabled : ''
			)}
			{...props}
		>
			{children}
		</div>
	);
};

export default AssignerInputLayout;
