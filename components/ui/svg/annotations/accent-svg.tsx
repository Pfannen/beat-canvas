import { FunctionComponent, SVGProps } from 'react';
import classes from './AccentSVG.module.css';

interface AccentSVGProps extends SVGProps<SVGSVGElement> {}

const AccentSVG: FunctionComponent<AccentSVGProps> = ({ fill, ...props }) => {
	return (
		<svg
			width="22"
			height="12"
			viewBox="0 0 22 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M0.158694 9.35318C4.55201 8.28146 8.93698 7.20974 13.3303 6.13802C8.88686 4.90392 4.44343 3.67794 0 2.45196L1.32802 0C8.21868 2.13532 15.1093 4.27064 22 6.40595C14.9089 8.27334 7.82612 10.1326 0.743356 12C0.551253 11.115 0.35915 10.2382 0.167046 9.35318H0.158694Z"
				fill={fill || '#F4F9FA'}
			/>
		</svg>
	);
};

export default AccentSVG;
