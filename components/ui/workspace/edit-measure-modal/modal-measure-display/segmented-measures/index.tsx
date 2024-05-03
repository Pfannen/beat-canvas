import { Measure } from '@/components/providers/music/types';
import classes from './index.module.css';
import { CSSProperties, FunctionComponent } from 'react';
import MeasureSegments from './measure-segments';
import {
	MeasureComponentIterator,
	MeasureComponentValues,
} from '@/types/music-rendering';
import { Coordinate } from '@/types';
import { PositionData } from '@/types/ui/music-modal';
import { RequiredMeasureAttributes } from '@/types/music';

type SegmentedMeasuresProps = {
	measures: Measure[];
	onPositionClick: (position: Coordinate, positionData: PositionData) => void;
	isSegmentSelected: (measureIndex: number, xPos: number) => boolean;
	componentIterator: MeasureComponentIterator;
	isYPosSelected: (measureIndex: number, xPos: number, yPos: number) => boolean;
	componentFractions: MeasureComponentValues;
	noteHeight: string;
	noteOffset: string;
	getAttributes?: (measureIndex: number) => RequiredMeasureAttributes | null;
};

const SegmentedMeasures: FunctionComponent<SegmentedMeasuresProps> = ({
	measures,
	onPositionClick,
	isSegmentSelected,
	componentIterator,
	isYPosSelected,
	componentFractions,
	noteHeight,
	noteOffset,
	getAttributes,
}) => {
	const getSegmentClickDel =
		(measureIndex: number) =>
		(position: Coordinate, noteIndices?: number[]) => {
			onPositionClick(position, { measureIndex, noteIndices });
		};
	return (
		<div className={classes.measures}>
			{measures.map((measure, i) => {
				const attrs = getAttributes && getAttributes(i);
				//console.log({ attrs });
				return (
					<div
						className={classes.measure}
						style={{ '--offset': noteOffset } as CSSProperties}
						key={i}
					>
						<MeasureSegments
							onSegmentClick={getSegmentClickDel(i)}
							componentFractions={componentFractions}
							measure={measure}
							componentIterator={componentIterator}
							noteContainerHeight={noteHeight}
							isSegmentSelected={(xPos) => isSegmentSelected(i, xPos)}
							canSegmentSplit={() => true}
							isYPosSelected={isYPosSelected.bind(null, i)}
							timeSignature={attrs?.timeSignature}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default SegmentedMeasures;
