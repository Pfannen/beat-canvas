import { FunctionComponent } from 'react';
import classes from './DynamicAttributeAssignerSet.module.css';
import { MeasureAttributeAssigner } from '@/types/modify-score';
import { SelectionMetadata } from '@/types/modify-score/assigner/metadata';
import { MeasureAttributes } from '@/types/music';
import AssignerRowLayout from '../../style/assigner-row-layout';
import DynamicAssignerDropdown from '../dynamic-assigner';

interface DynamicAttributeAssignerSetProps {
	assigner: MeasureAttributeAssigner;
	attributeMetadata?: SelectionMetadata<MeasureAttributes>;
}

const DynamicAttributeAssignerSet: FunctionComponent<
	DynamicAttributeAssignerSetProps
> = ({ assigner, attributeMetadata }) => {
	return (
		<>
			<AssignerRowLayout>
				<DynamicAssignerDropdown
					metadataEntry={attributeMetadata?.dynamic}
					assigner={assigner}
				/>
			</AssignerRowLayout>
		</>
	);
};

export default DynamicAttributeAssignerSet;
