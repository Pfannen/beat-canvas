import { FunctionComponent, SVGProps } from 'react';
import classes from './StopButtonSVG.module.css';

interface StopButtonSVGProps extends SVGProps<SVGSVGElement> {}

const StopButtonSVG: FunctionComponent<StopButtonSVGProps> = ({ ...props }) => {
	return (
		<svg
			width="33"
			height="33"
			viewBox="0 0 33 33"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<circle cx="16.5" cy="16.5" r="16.5" fill="#3D434F" />
			<rect
				x="8.99997"
				y="9.12769"
				width="4.91489"
				height="14.7447"
				rx="1.40426"
				fill="#F4F9FA"
			/>
			<rect
				x="18.8297"
				y="9.12769"
				width="4.91489"
				height="14.7447"
				rx="1.40426"
				fill="#F4F9FA"
			/>
		</svg>
	);
};

export default StopButtonSVG;
