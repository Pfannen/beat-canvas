import { FunctionComponent } from 'react';
import classes from './static-attributes-assigner-set.module.css';
import KeySignatureAssigner from './key-signature-assigner';
import TimeSignatureAssigner from './time-signature-assigner';
import MetronomeAssigner from './metronome-assigner';
import RepeatAssigner from './repeat-assigner';
import { AssignerLifter } from '@/types/modify-score/assigner';
import { SelectionMetadata } from '@/types/modify-score/assigner/metadata';
import { MeasureAttributes } from '@/types/music';
import { MeasureAttributeAssigner } from '@/types/modify-score';
import LayoutList from '../../layout/list';
import AssignerSetTitle from '../style/assigner-set-title';

interface StaticAttributesAssignerSetProps {
	assigner: MeasureAttributeAssigner;
	attributeMetadata?: SelectionMetadata<MeasureAttributes>;
}

const StaticAttributesAssignerSet: FunctionComponent<
	StaticAttributesAssignerSetProps
> = ({ assigner, attributeMetadata }) => {
	return (
		<>
        <AssignerSetTitle title="Static Measure Attributes" />
			<div className={classes.static_container}>
				<KeySignatureAssigner
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
				/>
				<RepeatAssigner
					assigner={assigner}
					metadataEntry={attributeMetadata?.repeat}
				/>
			</div>
		</>
	);
};

export default StaticAttributesAssignerSet;
