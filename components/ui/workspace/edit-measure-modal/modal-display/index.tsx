import {
	Measure,
	Note,
	NoteType,
	TimeSignature,
} from '@/components/providers/music/types';
import classes from './index.module.css';
import { CSSProperties, FunctionComponent } from 'react';
import { Selection } from '@/components/hooks/useSelection';
import ModalMeasureDispay from '../modal-measure-display';
import { ABOVE_BELOW_CT } from '@/objects/measurement/constants';
import { PositionData } from '@/types/ui/music-modal';
import { Coordinate } from '@/objects/measurement/types';
import AssignerButtonRepo from '@/components/ui/reusable/assigner-components/assigner-button-repo';
import { stacklessNotePlacementValidator } from '@/utils/music/note-placement';
import { useEditMeasures } from '@/components/hooks/useEditMeasures';

const aspectRatio = 4;

type ModalDisplayProps = {
	getMeasures: (startIndex: number, count: number) => Measure[];
	selectedMeasures: Selection;
};

const ModalDisplay: FunctionComponent<ModalDisplayProps> = ({
	getMeasures,
	selectedMeasures,
}) => {
	const { start, end } = selectedMeasures;
	const {
		editMeasures,
		selections,
		iterateEditMeasures,
		executeAssigner,
		updateSelection,
		commitMeasures,
	} = useEditMeasures(start, end);

	const onPositionClick = (
		position: Coordinate,
		positionData: PositionData
	) => {
		console.log(position, positionData);
		const { x, y } = position;
		const { measureIndex, noteIndices } = positionData;
		updateSelection(measureIndex, x, x, y, noteIndices && noteIndices[0]);
	};
	return (
		<>
			<div
				className={classes.measures}
				style={{ '--aspect-ratio': aspectRatio } as CSSProperties}
			>
				<ModalMeasureDispay
					aspectRatio={aspectRatio}
					measures={editMeasures}
					aboveBelowCt={ABOVE_BELOW_CT}
					onPositionClick={onPositionClick}
					startMeasureGlobalIndex={0}
				/>
			</div>
			<AssignerButtonRepo
				selections={selections}
				notePlacementValidator={stacklessNotePlacementValidator}
				liftExecutor={executeAssigner}
			/>
		</>
	);
};

export default ModalDisplay;
