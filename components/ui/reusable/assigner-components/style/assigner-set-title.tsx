import { FunctionComponent } from 'react';
import classes from './assigner-set-title.module.css';

interface AssigerSetTitleProps {
	title: string;
}

const AssigerSetTitle: FunctionComponent<AssigerSetTitleProps> = ({
	title,
}) => {
	return <h3 className={classes.title}>{title}</h3>;
};

export default AssigerSetTitle;
