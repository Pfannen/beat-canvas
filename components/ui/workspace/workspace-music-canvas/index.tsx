'use client';

import { useMusic } from '@/components/providers/music';
import classes from './index.module.css';
import { CSSProperties, FunctionComponent } from 'react';
import MeasureSelectCanvas from '../../reusable/music-canvas/measure-select-canvas';

type WorkspaceMusicCanvasProps = {
	aspectRatio: number;
	onMeasureClick: (index: number) => void;
	isMeasureSelected: (index: number) => boolean;
	areMeasuresSelected: boolean;
};

const WorkspaceMusicCanvas: FunctionComponent<WorkspaceMusicCanvasProps> = ({
	aspectRatio,
	onMeasureClick,
	isMeasureSelected,
	areMeasuresSelected,
}) => {
	const {
		measuresItems: { measures },
	} = useMusic();
	return (
		<div
			className={classes.canvas}
			style={{ '--aspect-ratio': aspectRatio } as CSSProperties}
		>
			<MeasureSelectCanvas
				measures={measures}
				aspectRatio={aspectRatio}
				onMeasureClick={({ measureIndex }) => {
					onMeasureClick(measureIndex);
				}}
				getMeasureClassName={({ measureIndex }) => {
					return areMeasuresSelected
						? isMeasureSelected(measureIndex)
							? classes.selected
							: classes.not_selected
						: '';
				}}
			/>
		</div>
	);
};

export default WorkspaceMusicCanvas;
