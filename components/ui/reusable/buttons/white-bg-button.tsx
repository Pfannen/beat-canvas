import { ButtonHTMLAttributes, FunctionComponent } from 'react';
import classes from './white-bg-button.module.css';
import { concatClassNames } from '@/utils/css';

interface WhiteBgButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string;
}

const WhiteBgButton: FunctionComponent<WhiteBgButtonProps> = ({
	className,
	...props
}) => {
	return (
		<button
			className={concatClassNames(classes.white_bg_btn, className)}
			{...props}
		>
			{props.children}
		</button>
	);
};

export default WhiteBgButton;
