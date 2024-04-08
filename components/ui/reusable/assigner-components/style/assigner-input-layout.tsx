import { FunctionComponent, HTMLAttributes, ReactNode } from 'react';
import classes from './assigner-input-layout.module.css';
import { concatClassNames } from '@/utils/css';

interface AssignerInputLayoutProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

const AssignerInputLayout: FunctionComponent<AssignerInputLayoutProps> = ({
	children,
	className,
	...props
}) => {
	return (
		<div
			className={concatClassNames(className, classes.assigner_container)}
			{...props}
		>
			{children}
		</div>
	);
};

export default AssignerInputLayout;
