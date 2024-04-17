import { FunctionComponent, SVGProps } from 'react';
import classes from './PlayButtonSVG.module.css';

interface PlayButtonSVGProps extends SVGProps<SVGSVGElement> {}

const PlayButtonSVG: FunctionComponent<PlayButtonSVGProps> = ({ ...props }) => {
	return (
		<svg
			width="33"
			height="33"
			viewBox="0 0 33 33"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<circle cx="16.4356" cy="16.4356" r="16.4356" fill="#3D434F" />
			<path
				d="M13.2883 23.7791L13.2883 9.79138L23.7791 16.7852L13.2883 23.7791Z"
				fill="#F4F9FA"
				stroke="#F4F9FA"
				strokeWidth="2.09816"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default PlayButtonSVG;
