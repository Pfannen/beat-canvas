'use client';

import {
	CSSProperties,
	FunctionComponent,
	MutableRefObject,
	useEffect,
} from 'react';
import classes from './index.module.css';
import useWorkSpace from '../../hooks/workspace/useWorkspace';
import ControlButtons from './control-buttons';
import EditMeasureModal from './edit-measure-modal';
import { useMusic } from '@/components/providers/music';
import { ControlButton } from '@/types/workspace';
import { MemoizedMeasureSelectedCanvas } from '../reusable/music-canvas/measure-select-canvas';
import useOverlayPositions from '@/components/hooks/workspace/useOverlayPositions';
import MeasureSelectOverlay from './measure-select-overlay';
import { Selection } from '@/components/hooks/useSelection';
import { useGlobalWorkspace } from '@/components/providers/workspace';

const height = 900;
const unit = 'px';
const aspectRatio = 0.75;

type WorkspaceProps = {};

const Workspace: FunctionComponent<WorkspaceProps> = () => {
	const { overlayPositions, onMeasureRendered } = useOverlayPositions(height);
	const ws = useGlobalWorkspace();
	const { measuresItems } = useMusic();
	const currentMode = ws.mode.get();
	const isPlayback = currentMode === 'playback';
	const isLooping = currentMode === 'loop';

	const buttons: ControlButton[] = [
		{
			label: 'Add',
			buttonProps: {
				onClick: ws.measureDels.addMeasureSelection,
				disabled: isPlayback || isLooping,
			},
		},
		{
			label: 'Remove',
			buttonProps: {
				onClick: ws.measureDels.removeMeasureSelection,
				disabled: !ws.isSelectedMeasures() || isPlayback || isLooping,
			},
		},
		{
			label: 'Duplicate',
			buttonProps: {
				onClick: ws.mode.set.bind(null, 'duplicate'),
				disabled: !ws.isSelectedMeasures() || isPlayback || isLooping,
			},
		},
		{
			label: 'Modify',
			buttonProps: {
				onClick: ws.mode.set.bind(null, 'modify'),
				disabled: !ws.isSelectedMeasures() || isPlayback || isLooping,
			},
		},
		{
			label: currentMode !== 'loop' ? 'Loop' : 'Stop Looping',
			buttonProps: {
				onClick:
					currentMode !== 'loop'
						? ws.mode.set.bind(null, 'loop')
						: ws.mode.clear,
				disabled: !ws.isSelectedMeasures() || isPlayback,
			},
		},
	];

	const modalShouldOpen = currentMode === 'modify' && ws.isSelectedMeasures();

	return (
		<>
			<ControlButtons buttons={buttons} />
			<div
				className={classes.music_canvas}
				style={{ '--aspect-ratio': aspectRatio } as CSSProperties}
			>
				<MemoizedMeasureSelectedCanvas
					height={height}
					measures={measuresItems.measures}
					unit={unit}
					aspectRatio={aspectRatio}
					onMeasureRendered={onMeasureRendered}
				/>
				<MeasureSelectOverlay
					overlayPositions={overlayPositions}
					onMeasureSelect={ws.onMeasureClick}
					isMeasureSelected={ws.isMeasureSelected}
					areSelections={ws.isSelectedMeasures()}
				/>
			</div>
			<EditMeasureModal
				showModal={modalShouldOpen}
				onClose={ws.mode.clear}
				selectedMeasures={ws.getSelectedMeasures()!}
			/>
		</>
	);
};

export default Workspace;
