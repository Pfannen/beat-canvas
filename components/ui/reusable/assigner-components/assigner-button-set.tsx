import { FunctionComponent, ReactNode } from 'react';
import classes from './assigner-button-set.module.css';
import LayoutList from '../layout/list';

interface AssignerButtonSetProps {
	children?: ReactNode;
}

const AssignerButtonSet: FunctionComponent<AssignerButtonSetProps> = ({
	children,
}) => {
	return (
		<LayoutList
			className={classes.set_container}
			layoutProps={{
				'--list-item-width': '35px',
				'--list-item-height': 'repeat(auto-fit, 35px)',
			}}
		>
			{children}
		</LayoutList>
	);
};

export default AssignerButtonSet;
