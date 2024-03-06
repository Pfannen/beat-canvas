import { FunctionComponent, ReactNode, useState } from 'react';
import classes from './dropdown-list.module.css';
import DropdownHeader, { DropdownHeaderProps } from './dropdown-header';
import { concatClassNames } from '@/utils/css';

interface DropdownListProps
	extends Omit<DropdownHeaderProps, 'headerClassName'> {
	children: ReactNode;
	className?: string;
	selectionsClassName?: string;
}

const DropdownList: FunctionComponent<DropdownListProps> = ({
	children,
	className,
	selectionsClassName,
	...headerProps
}) => {
	const [show, setShow] = useState(true);

	return (
		<div className={concatClassNames(className, classes.dropdown)}>
			<DropdownHeader
				{...headerProps}
				onClick={() => setShow((prev) => !prev)}
			/>
			<ul
				className={concatClassNames(
					selectionsClassName,
					classes.ul,
					show ? classes.show : classes.hide
				)}
			>
				{children}
			</ul>
		</div>
	);
};

export default DropdownList;
