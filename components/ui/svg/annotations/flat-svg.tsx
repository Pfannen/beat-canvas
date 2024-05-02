import { FunctionComponent, SVGProps } from 'react';
import classes from './FlatSVG.module.css';

interface FlatSVGProps extends SVGProps<SVGSVGElement> {}

const FlatSVG: FunctionComponent<FlatSVGProps> = (props) => {
	return (
		<svg
			id="svg1361"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 5.03 13"
			{...props}
		>
			<g id="layer1">
				<g id="g2111">
					<path
						id="path2117"
						fill="#f4f9fa"
						strokeWidth="0px"
						d="M3.22,8.38c0,.57-.22,1.13-.81,1.86-.63.78-1.15,1.23-1.85,1.76v-3.43c.16-.4.39-.72.7-.97.31-.25.62-.37.94-.37.52,0,.85.3,1,.89.02.05.02.14.02.26ZM3.14,5.98c-.43,0-.87.12-1.32.36-.45.24-.87.56-1.27.95V.02h-.56v12.45c0,.35.1.53.29.53.11,0,.25-.09.46-.22.58-.35.95-.58,1.34-.83.45-.28.96-.61,1.63-1.25.46-.46.8-.93,1.01-1.41.21-.47.31-.94.31-1.41,0-.69-.18-1.18-.55-1.47-.41-.3-.86-.46-1.34-.46Z"
					/>
				</g>
			</g>
		</svg>
	);
};

export default FlatSVG;
