import { FunctionComponent, SVGProps } from 'react';
import classes from './ImportIconSVG.module.css';

interface ImportIconSVGProps extends SVGProps<SVGSVGElement> {}

const ImportIconSVG: FunctionComponent<ImportIconSVGProps> = (props) => {
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
					d="M7.79327 1.41667H13.875C14.0629 1.41667 14.243 1.49129 14.3759 1.62413C14.5087 1.75697 14.5834 1.93714 14.5834 2.125V12.0417C14.5834 12.2295 14.5087 12.4097 14.3759 12.5425C14.243 12.6754 14.0629 12.75 13.875 12.75H1.12502C0.937159 12.75 0.756991 12.6754 0.624153 12.5425C0.491315 12.4097 0.416687 12.2295 0.416687 12.0417V0.708333C0.416687 0.520472 0.491315 0.340304 0.624153 0.207466C0.756991 0.0746277 0.937159 0 1.12502 0H6.3766L7.79327 1.41667ZM8.20835 7.08333V4.25H6.79169V7.08333H4.66669L7.50002 9.91667L10.3334 7.08333H8.20835Z"
					fill="#3D434F"
				/>
			</svg>
		</>
	);
};

export default ImportIconSVG;
