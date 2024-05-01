import { FunctionComponent } from 'react';
import classes from './measure-attribute-assigner-set.module.css';
import { MeasureAttributeAssigner } from '@/types/modify-score';
import { Dynamic } from '@/types/music/note-annotations';
import { AssignerLifter } from '@/types/modify-score/assigner';
import { SelectionMetadata } from '@/types/modify-score/assigner/metadata';
import { curriedModifyMeasureAttribute } from '@/utils/music/modify-score/curried-assigners';
import { MeasureAttributes } from '@/types/music';
import AssignerSetTitle from '../../style/assigner-set-title';
import DynamicAssignerDropdown from '../dynamic-assigner';
import RepeatAssigner from '../repeat-assigner';

// Purely for testing purposes
const dynamics: Dynamic[] = ['p', 'pp', 'mp', 'mf', 'fp', 'f', 'ff'];

interface MeasureAttributeAssignerSetProps {
	liftExecuter?: AssignerLifter;
	attributeMetadata?: SelectionMetadata<MeasureAttributes>;
}

const MeasureAttributeAssignerSet: FunctionComponent<
	MeasureAttributeAssignerSetProps
> = ({ liftExecuter, attributeMetadata }) => {
	const assigner: MeasureAttributeAssigner = (attribute, value) => {
		console.log({ attribute, value });

		if (!liftExecuter) return;

		liftExecuter(curriedModifyMeasureAttribute(attribute, value));
	};

	return (
		<div className={classes.measure_container}>
			<AssignerSetTitle title="Dynamic Measure Attributes" />
			<div className={classes.dropdowns}>
				<DynamicAssignerDropdown
					metadataEntry={attributeMetadata?.dynamic}
					assigner={assigner}
				/>
				{/* <KeySignatureAssigner
					assigner={assigner}
					metadataEntry={attributeMetadata?.keySignature}
				/>
				<TimeSignatureAssigner
					assigner={assigner}
					metadataEntry={attributeMetadata?.timeSignature}
				/>
				<MetronomeAssigner
					assigner={assigner}
					metadataEntry={attributeMetadata?.metronome}
				/> */}
				<RepeatAssigner
					assigner={assigner}
					metadataEntry={attributeMetadata?.repeat}
				/>
				{/* <AssignerDropdown<MeasureAttributes, 'wedge'>
					assigner={assigner}
					label="Wedge"
					tKey="wedge"
					metadataEntry={attributeMetadata?.wedge}
				>
					{[
						{
							displayValue: 'Crescendo',
							el: <WedgeSVG height={'0'} />,
							value: { crescendo: true, start: true },
						},
						{
							displayValue: 'Decrescendo',
							el: <WedgeSVG height={'0'} />,
							value: { crescendo: false, start: true },
						},
					]}
				</AssignerDropdown> */}
			</div>
		</div>
	);
};

export default MeasureAttributeAssignerSet;
