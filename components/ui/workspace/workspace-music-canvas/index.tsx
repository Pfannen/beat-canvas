'use client';

import classes from './index.module.css';
import { CSSProperties, FunctionComponent } from 'react';
import MeasureSelectCanvas from '../../reusable/music-canvas/measure-select-canvas';
import { Measure } from '@/components/providers/music/types';
import {
	MeasureNotifierArgs,
	MeasureRenderArgs,
} from '@/types/music-rendering';
import MeasureSelectOverlay from './measure-select-overlay';

type WorkspaceMusicCanvasProps = {
	measures: Measure[];
	aspectRatio: number;
	onMeasureRendered: (args: MeasureNotifierArgs & { height: number }) => void;
	onMeasureSelect: (measureIndex: number) => void;
	isMeasureSelected: (measureIndex: number) => boolean;
	areSelections: boolean;
};

const WorkspaceMusicCanvas: FunctionComponent<WorkspaceMusicCanvasProps> = ({
	measures,
	aspectRatio,
	onMeasureRendered,
	onMeasureSelect,
	isMeasureSelected,
	areSelections,
}) => {
	const positions: MeasureRenderArgs[] = [];
	return (
		<div
			className={classes.canvas}
			style={{ '--aspect-ratio': aspectRatio } as CSSProperties}
		>
			<MeasureSelectCanvas
				measures={measures}
				aspectRatio={aspectRatio}
				onMeasureRendered={(position) => positions.push(position)}
			/>
			<MeasureSelectOverlay
				measurePositions={positions}
				onMeasureSelect={onMeasureSelect}
				isMeasureSelected={isMeasureSelected}
				areSelections={areSelections}
			/>
		</div>
	);
};

export default WorkspaceMusicCanvas;
