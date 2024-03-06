import { FunctionComponent, SVGProps } from 'react';
import classes from './DropdownArrow.module.css';

interface DropdownArrowProps extends SVGProps<SVGSVGElement> {}

const DropdownArrow: FunctionComponent<DropdownArrowProps> = (props) => {
	return (
		<>
			<svg
				width="11"
				height="7"
				viewBox="0 0 11 7"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				{...props}
			>
				<path
					d="M1.64288 5.375L5.50003 1.625L9.35717 5.375"
					stroke="#3D434F"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</>
	);
};

export default DropdownArrow;
