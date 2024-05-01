import { FunctionComponent } from 'react';
import classes from './static-attributes-assigner-set.module.css';
import KeySignatureAssigner from '../key-signature-assigner';
import TimeSignatureAssigner from '../time-signature-assigner';
import MetronomeAssigner from '../metronome-assigner';
import RepeatAssigner from '../repeat-assigner';
import { AssignerLifter } from '@/types/modify-score/assigner';
import { SelectionMetadata } from '@/types/modify-score/assigner/metadata';
import { MeasureAttributes } from '@/types/music';
import { MeasureAttributeAssigner } from '@/types/modify-score';
import LayoutList from '../../../layout/list';
import AssignerSetTitle from '../../style/assigner-set-title';
import AssignerRowLayout from '../../style/assigner-row-layout';
import ClefAssigner from '../clef-assigner';
import DynamicAssigner from '../buttons/dynamic';
import DynamicAssignerDropdown from '../dynamic-assigner';

interface StaticAttributesAssignerSetProps {
	assigner: MeasureAttributeAssigner;
	attributeMetadata?: SelectionMetadata<MeasureAttributes>;
}

const StaticAttributesAssignerSet: FunctionComponent<
	StaticAttributesAssignerSetProps
> = ({ assigner, attributeMetadata }) => {
	return (
		<>
			<AssignerSetTitle title="Measure Attributes" />
			<AssignerRowLayout>
				<ClefAssigner
					assigner={assigner}
					metadataEntry={attributeMetadata?.clef}
				/>
				<TimeSignatureAssigner
					assigner={assigner}
					metadataEntry={attributeMetadata?.timeSignature}
				/>
				<KeySignatureAssigner
					assigner={assigner}
					metadataEntry={attributeMetadata?.keySignature}
				/>
				<MetronomeAssigner
					assigner={assigner}
					metadataEntry={attributeMetadata?.metronome}
				/>
				<RepeatAssigner
					assigner={assigner}
					metadataEntry={attributeMetadata?.repeat}
				/>
				<DynamicAssignerDropdown
					assigner={assigner}
					metadataEntry={attributeMetadata?.dynamic}
				/>
			</AssignerRowLayout>
		</>
	);
};

export default StaticAttributesAssignerSet;
