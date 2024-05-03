import { FunctionComponent, SVGProps } from 'react';
import classes from './NaturalSVG.module.css';

interface NaturalSVGProps extends SVGProps<SVGSVGElement> {}

const NaturalSVG: FunctionComponent<NaturalSVGProps> = (props) => {
	return (
		<svg
			id="svg1935"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 26.58 107.58"
			{...props}
		>
			<path
				id="flowRoot1871"
				fill="#f4f9fa"
				strokeWidth="0px"
				d=" M26.58,106.17l-3.94,1.41v-32.2L0,85.22V1.69L3.8,0v32.77l22.78-10.41v83.81ZM22.64,61.17v-22.5L3.8,46.97v22.5l18.84-8.3Z"
			/>
		</svg>
	);
};

export default NaturalSVG;
