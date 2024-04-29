import { FunctionComponent, ReactNode } from 'react';
import classes from './assigner-button-set.module.css';
import LayoutList from '../../layout/list';
import AssignerSetTitle from './assigner-set-title';

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
			{title && <AssignerSetTitle title={title} />}
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
