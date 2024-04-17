import { FunctionComponent, SVGProps } from 'react';
import classes from './FullSeekSVG.module.css';

interface FullSeekSVGProps extends SVGProps<SVGSVGElement> {
	right?: boolean;
}

const FullSeekSVG: FunctionComponent<FullSeekSVGProps> = ({
	right,
	...props
}) => {
	return (
		<svg
			width="20"
			height="22"
			viewBox="0 0 20 22"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			style={right ? { transform: 'rotateZ(180deg)' } : {}}
			{...props}
		>
			<path
				d="M18.1841 2L18.1841 20.6069L4.22885 11.3035L18.1841 2Z"
				fill="#3D434F"
				stroke="#3D434F"
				strokeWidth="2.11442"
				strokeLinejoin="round"
			/>
			<rect
				y="2.42291"
				width="4.22885"
				height="17.3383"
				rx="0.84577"
				fill="#3D434F"
			/>
		</svg>
	);
};

export default FullSeekSVG;
