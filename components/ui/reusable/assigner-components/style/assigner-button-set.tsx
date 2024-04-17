import { FunctionComponent, ReactNode } from 'react';
import classes from './assigner-button-set.module.css';
import LayoutList from '../../layout/list';

interface AssignerButtonSetProps {
	title?: string;
	children?: ReactNode;
}

const AssignerButtonSet: FunctionComponent<AssignerButtonSetProps> = ({
	title,
	children,
}) => {
	return (
		<div className={classes.set}>
			{title && <h3 className={classes.title}>{title}</h3>}
			<LayoutList
				className={classes.buttons}
				layoutProps={{
					'--list-item-width': '35px',
					'--list-item-height': '35px',
				}}
			>
				{children}
			</LayoutList>
		</div>
	);
};

export default AssignerButtonSet;
