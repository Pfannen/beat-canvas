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
};

interface LayoutListProps extends HTMLAttributes<HTMLUListElement> {
	children?: ReactNode;
	layoutProps?: Partial<LayoutListCSSProps>;
}

const LayoutList: FunctionComponent<LayoutListProps> = ({
	children,
	className,
	layoutProps = {},
	...props
}) => {
	return (
		<ul
			className={concatClassNames(classes.list, className)}
			{...props}
			style={layoutProps as CSSProperties}
		>
			{children}
		</ul>
	);
};

export default LayoutList;
