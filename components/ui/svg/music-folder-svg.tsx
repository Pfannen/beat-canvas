import { FunctionComponent, SVGProps } from 'react';
import classes from './MusicFolderSVG.module.css';

interface MusicFolderSVGProps extends SVGProps<SVGSVGElement> {}

const MusicFolderSVG: FunctionComponent<MusicFolderSVGProps> = (props) => {
	return (
		<>
			<svg
				width="17"
				height="17"
				viewBox="0 0 17 17"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				{...props}
			>
				<g clipPath="url(#clip0_16_1043)">
					<path
						d="M8.79327 3.54167H14.875C15.0629 3.54167 15.2431 3.61629 15.3759 3.74913C15.5087 3.88197 15.5834 4.06214 15.5834 4.25V14.1667C15.5834 14.3545 15.5087 14.5347 15.3759 14.6675C15.2431 14.8004 15.0629 14.875 14.875 14.875H2.12502C1.93716 14.875 1.75699 14.8004 1.62415 14.6675C1.49131 14.5347 1.41669 14.3545 1.41669 14.1667V2.83333C1.41669 2.64547 1.49131 2.4653 1.62415 2.33247C1.75699 2.19963 1.93716 2.125 2.12502 2.125H7.3766L8.79327 3.54167ZM7.79169 9.24375C7.43365 9.17067 7.06177 9.21013 6.72705 9.35674C6.39233 9.50335 6.11116 9.74992 5.9221 10.0626C5.73305 10.3754 5.64536 10.7389 5.67108 11.1034C5.69679 11.4679 5.83464 11.8156 6.06572 12.0986C6.29681 12.3817 6.60981 12.5864 6.96179 12.6845C7.31378 12.7827 7.68752 12.7696 8.03175 12.647C8.37599 12.5243 8.67385 12.2982 8.88451 11.9996C9.09516 11.701 9.20828 11.3446 9.20835 10.9792V7.79167H11.3334V6.375H7.79169V9.24375Z"
						fill="#3D434F"
					/>
				</g>
				<defs>
					<clipPath id="clip0_16_1043">
						<rect width="17" height="17" fill="white" />
					</clipPath>
				</defs>
			</svg>
		</>
	);
};

export default MusicFolderSVG;
