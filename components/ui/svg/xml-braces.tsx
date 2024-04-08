import { FunctionComponent, SVGProps } from 'react';
import classes from './XMLBracesSVG.module.css';

interface XMLBracesSVGProps extends SVGProps<SVGSVGElement> {}

const XMLBracesSVG: FunctionComponent<XMLBracesSVGProps> = (props) => {
	return (
		<>
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				{...props}
			>
				<g clipPath="url(#clip0_16_1139)">
					<path
						d="M13.4166 6.99999L9.2919 11.1247L8.46706 10.2999L11.767 6.99999L8.46706 3.70008L9.2919 2.87524L13.4166 6.99999ZM2.23298 6.99999L5.5329 10.2999L4.70806 11.1247L0.583313 6.99999L4.70806 2.87524L5.5329 3.70008L2.23298 6.99999Z"
						fill="#CED3DD"
					/>
				</g>
				<defs>
					<clipPath id="clip0_16_1139">
						<rect width="14" height="14" fill="white" />
					</clipPath>
				</defs>
			</svg>
		</>
	);
};

export default XMLBracesSVG;
