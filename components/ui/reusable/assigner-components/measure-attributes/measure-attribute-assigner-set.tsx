import { FunctionComponent } from 'react';
import classes from './measure-attribute-assigner-set.module.css';
import { MeasureAttributeAssigner } from '@/types/modify-score';
import { Dynamic } from '@/types/music/note-annotations';
import { AssignerLifter } from '@/types/modify-score/assigner';
import { SelectionMetadata } from '@/types/modify-score/assigner/metadata';
import { curriedModifyMeasureAttribute } from '@/utils/music/modify-score/music-hook-helpers';
import TimeSignatureAssigner from './time-signature-assigner';
import MetronomeAssigner from './metronome-assigner';
import { MeasureAttributes } from '@/types/music';
import DynamicAssignerDropdown from './dynamic-assigner';
import KeySignatureAssigner from './key-signature-assigner';

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
			{/* <AssignerButtonSet title="Measure Attributes">
				{dynamics.map((dynamic) => (
					<DynamicAssigner
						key={dynamic}
						dynamic={dynamic}
						assigner={assigner}
						attributeMetadata={attributeMetadata?.dynamic}
					/>
				))}
			</AssignerButtonSet> */}
			<div className={classes.dropdowns}>
				<DynamicAssignerDropdown
					attributeMetadata={attributeMetadata?.dynamic}
					assigner={assigner}
				/>
				<KeySignatureAssigner
					assigner={assigner}
					attributeMetadata={attributeMetadata?.keySignature}
				/>
				<TimeSignatureAssigner
					assigner={assigner}
					attributeMetadata={attributeMetadata?.timeSignature}
				/>
				<MetronomeAssigner
					assigner={assigner}
					attributeMetadata={attributeMetadata?.metronome}
				/>
			</div>
		</div>
	);
};

export default MeasureAttributeAssignerSet;
