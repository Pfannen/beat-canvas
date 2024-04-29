import {
	MeasureComponentIterator,
	MeasureComponentValues,
} from '@/types/music-rendering';
import classes from './index.module.css';
import { CSSProperties, FunctionComponent, ReactNode } from 'react';
import MeasureComponent from './measure-component';
import { fractionToPercent } from '@/utils';
import SegmentButton from './segment-button';
import { concatClassNames } from '@/utils/css';

export type SegmentPaneProps = {
	width: number;
	isSelected: boolean;
	componentIterator: MeasureComponentIterator;
	componentFractions: MeasureComponentValues;
	onComponentClick: (yPos: number) => void;
	noteContainerHeight: number;
	onSplit: () => void;
	onJoin: () => void;
	onCollapse: () => void;
	isYPosSelected: (yPos: number) => boolean;
};

const SegmentPane: FunctionComponent<SegmentPaneProps> = ({
	width,
	isSelected,
	componentIterator,
	componentFractions,
	onComponentClick,
	noteContainerHeight,
	onSplit,
	onJoin,
	onCollapse,
	isYPosSelected,
}) => {
	const components: ReactNode[] = [];
	componentIterator((component) => {
		const height = component.isLine
			? componentFractions.line
			: componentFractions.space;
		components.push(
			<MeasureComponent
				height={fractionToPercent(height)}
				onClick={onComponentClick.bind(null, component.yPos)}
				isSelected={isYPosSelected(component.yPos)}
			/>
		);
	});
	return (
		<div
			className={concatClassNames(classes.pane, isSelected && classes.selected)}
			style={
				{
					'--width': fractionToPercent(width),
					'--height': noteContainerHeight + '%',
				} as CSSProperties
			}
		>
			<SegmentButton
				onClick={onSplit}
				className={concatClassNames(classes.pane_button, classes.split)}
			>
				Split
			</SegmentButton>
			{components}
			<SegmentButton onClick={onJoin} className={classes.pane_button}>
				Join
			</SegmentButton>
		</div>
	);
};

export default SegmentPane;
