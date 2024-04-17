import {
	CSSProperties,
	FunctionComponent,
	HTMLAttributes,
	ReactNode,
} from 'react';
import classes from './list.module.css';
import { concatClassNames } from '@/utils/css';

export type LayoutListCSSProps = {
	'--list-item-width': string;
	'--list-item-height': string;
	'--list-gap': string;
	'--list-padding': string;
	'--auto': 'auto-fit' | 'auto-fill';
};

interface LayoutListProps extends HTMLAttributes<HTMLUListElement> {
	direction?: 'column' | 'row';
	children?: ReactNode;
	layoutProps?: Partial<LayoutListCSSProps>;
}

const LayoutList: FunctionComponent<LayoutListProps> = ({
	direction = 'column',
	children,
	className,
	layoutProps = {},
	...props
}) => {
	return (
		<ul
			className={concatClassNames(classes.list, classes[direction], className)}
			{...props}
			style={layoutProps as CSSProperties}
		>
			{children}
		</ul>
	);
};

export default LayoutList;
