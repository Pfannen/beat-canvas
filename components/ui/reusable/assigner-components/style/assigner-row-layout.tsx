import { FunctionComponent, ReactNode } from 'react';
import classes from './assigner-row-layout.module.css';
import { concatClassNames } from '@/utils/css';

interface AssignerRowLayoutProps {
	children: ReactNode;
	className?: string;
}

const AssignerRowLayout: FunctionComponent<AssignerRowLayoutProps> = ({
	children,
	className,
}) => {
	return (
		<div className={concatClassNames(classes.assigner_container, className)}>
			{children}
		</div>
	);
};

export default AssignerRowLayout;
