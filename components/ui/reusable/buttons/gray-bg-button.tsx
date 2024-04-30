import { FunctionComponent } from 'react';
import classes from './gray-bg-button.module.css';
import { ButtonProps } from '@/types/ui';
import { concatClassNames } from '@/utils/css';

interface GrayBgButtonProps extends ButtonProps {}

const GrayBgButton: FunctionComponent<GrayBgButtonProps> = ({
	className,
	children,
	...props
}) => {
	return (
		<button
			{...props}
			className={concatClassNames(classes.gray_bg_button, className)}
		>
			{children}
		</button>
	);
};

export default GrayBgButton;
