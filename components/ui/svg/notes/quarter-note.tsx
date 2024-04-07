import { FunctionComponent, SVGProps } from 'react';
import classes from './QuarterNoteSVG.module.css';

interface QuarterNoteSVGProps extends SVGProps<SVGSVGElement> {}

const QuarterNoteSVG: FunctionComponent<QuarterNoteSVGProps> = ({
	...props
}) => {
	return (
		<svg
			width="9"
			height="24"
			viewBox="0 0 9 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M7.80441 18.1641C7.81988 17.9356 7.84308 17.7575 7.84308 17.5794C7.84308 12.1087 7.84308 6.64143 7.84308 1.17078C7.84308 1.00276 7.84308 0.834745 7.84308 0.666728C7.83922 0.424783 7.83922 0.176117 8.2182 0.179477C8.61653 0.186198 8.55852 0.465107 8.56625 0.68689C8.57399 0.945637 8.56625 1.20774 8.56625 1.46649C8.56625 7.41095 8.53145 13.352 8.58946 19.2965C8.60492 20.7549 7.9939 21.8369 6.69839 22.677C5.41061 23.5104 3.97974 23.9775 2.35938 23.6784C0.460577 23.3256 0.031316 21.9814 0.646203 20.7011C1.5434 18.8429 4.85373 17.1392 7.50277 18.1271C7.56078 18.1506 7.63425 18.1473 7.80054 18.1674L7.80441 18.1641Z"
				fill="#F4F9FA"
			/>
		</svg>
	);
};

export default QuarterNoteSVG;
