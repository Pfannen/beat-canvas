import { FunctionComponent, SVGProps } from 'react';
import classes from './SlurSVG.module.css';

interface SlurSVGProps extends SVGProps<SVGSVGElement> {}

const SlurSVG: FunctionComponent<SlurSVGProps> = (props) => {
	return (
		<svg
			id="Layer_1"
			data-name="Layer 1"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 25.71 28.08"
			{...props}
		>
			<path
				fill="#f4f9fa"
				strokeWidth="0px"
				d="M7.42,17.98c.02-.23.04-.41.04-.58V.49c0-.24,0-.49.38-.49.4,0,.34.29.35.51,0,.26,0,.52,0,.78,0,5.94-.03,11.89.02,17.83.02,1.46-.6,2.54-1.89,3.38-1.29.83-2.72,1.3-4.34,1-1.9-.35-2.33-1.7-1.71-2.98.9-1.86,4.21-3.56,6.86-2.57.06.02.13.02.3.04h0Z"
			/>
			<path
				fill="#f4f9fa"
				strokeWidth="0px"
				d="M24.94,17.98c.02-.23.04-.41.04-.58V.49c0-.24,0-.49.38-.49.4,0,.34.29.35.51,0,.26,0,.52,0,.78,0,5.94-.03,11.89.02,17.83.02,1.46-.6,2.54-1.89,3.38-1.29.83-2.72,1.3-4.34,1-1.9-.35-2.33-1.7-1.71-2.98.9-1.86,4.21-3.56,6.86-2.57.06.02.13.02.3.04h0Z"
			/>
			<path
				fill="#f4f9fa"
				strokeWidth="0px"
				d="M3.71,25.24c5.93,1.83,11.97,1.74,17.87,0,0,0,.09.2.09.2-5.29,3.41-12.73,3.32-18.04,0,0,0,.09-.2.09-.2h0Z"
			/>
		</svg>
	);
};

export default SlurSVG;
