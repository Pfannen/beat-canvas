import { FunctionComponent } from 'react';
import classes from './spinner.module.css';

interface SpinnerProps {}

const Spinner: FunctionComponent<SpinnerProps> = () => {
	return <div className={classes.spinner} />;
};

export default Spinner;
