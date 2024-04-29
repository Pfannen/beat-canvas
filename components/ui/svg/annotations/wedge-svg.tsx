import { FunctionComponent, SVGProps } from 'react';
import classes from './WedgeSVG.module.css';

interface WedgeSVGProps extends SVGProps<SVGSVGElement> {}

const WedgeSVG: FunctionComponent<WedgeSVGProps> = (props) => {
	return (
		<svg
			width="32"
			height="12"
			viewBox="0 0 32 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M0.230828 9.35318C6.62111 8.28146 12.9992 7.20974 19.3895 6.13802C12.9263 4.90392 6.46317 3.67794 0 2.45196L1.93166 0C11.9544 2.13532 21.9772 4.27064 32 6.40595C21.6856 8.27334 11.3834 10.1326 1.08125 12C0.801822 11.115 0.522399 10.2382 0.242976 9.35318H0.230828Z"
				fill="#F4F9FA"
			/>
		</svg>
	);
};

export default WedgeSVG;
