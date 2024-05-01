import classes from './index.module.css';
import { FunctionComponent } from 'react';
import ControlBtn from './control-button';
import { ControlButton } from '@/types/workspace';
import GrayBgButton from '../../reusable/buttons/gray-bg-button';

type ControlButtonsProps = {
	buttons: ControlButton[];
};

const ControlButtons: FunctionComponent<ControlButtonsProps> = ({
	buttons,
}) => {
	return (
		<ul className={classes.buttons}>
      <p>Measure Actions</p>
			{buttons.map(({ label, buttonProps }, i) => {
				return (
					<li key={i}>
						<GrayBgButton {...buttonProps}>{label}</GrayBgButton>
					</li>
				);
			})}
		</ul>
	);
};

export default ControlButtons;
