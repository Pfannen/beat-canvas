import { FunctionComponent, SVGProps } from 'react';
import classes from './ExportIconSVG.module.css';

interface ExportIconSVGProps extends SVGProps<SVGSVGElement> {}

const ExportIconSVG: FunctionComponent<ExportIconSVGProps> = (props) => {
	return (
		<>
			<svg
				width="15"
				height="13"
				viewBox="0 0 15 13"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				{...props}
			>
				<path
					d="M7.37658 1.41667H13.4583C13.6462 1.41667 13.8264 1.49129 13.9592 1.62413C14.092 1.75697 14.1667 1.93714 14.1667 2.125V12.0417C14.1667 12.2295 14.092 12.4097 13.9592 12.5425C13.8264 12.6754 13.6462 12.75 13.4583 12.75H0.708333C0.520472 12.75 0.340304 12.6754 0.207466 12.5425C0.0746277 12.4097 0 12.2295 0 12.0417V0.708333C0 0.520472 0.0746277 0.340304 0.207466 0.207466C0.340304 0.0746277 0.520472 0 0.708333 0H5.95992L7.37658 1.41667ZM7.79167 7.08333H9.91667L7.08333 4.25L4.25 7.08333H6.375V9.91667H7.79167V7.08333Z"
					fill="#3D434F"
				/>
			</svg>
		</>
	);
};

export default ExportIconSVG;
