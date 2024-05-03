import { FunctionComponent, SVGProps } from 'react';
import classes from './SharpSVG.module.css';

interface SharpSVGProps extends SVGProps<SVGSVGElement> {}

const SharpSVG: FunctionComponent<SharpSVGProps> = (props) => {
	return (
		<svg
			id="svg1361"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 5.84 19"
			{...props}
		>
			<g id="layer1">
				<g id="g2103">
					<path
						id="path2109"
						fill="#f4f9fa"
						strokeWidth="0px"
						d="M1.91,12.15v-4.7l2-.55v4.68l-2,.58ZM5.84,11.02l-1.38.39v-4.68l1.38-.38v-1.94l-1.38.38V0h-.56v4.93l-2,.57V.86h-.53v4.83l-1.38.39v1.95l1.38-.38v4.67l-1.38.38v1.94l1.38-.38v4.75h.53v-4.92l2-.55v4.63h.56v-4.8l1.38-.39v-1.95Z"
					/>
				</g>
			</g>
		</svg>
	);
};

export default SharpSVG;
