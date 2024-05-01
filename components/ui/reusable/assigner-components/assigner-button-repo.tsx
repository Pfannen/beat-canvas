import { FunctionComponent } from 'react';
import LayoutList from '../layout/list';
import AnnotationsAssignerSet from './annotations/annotations-assigner-set';
import NotePlacementAssignerSet from './place-note/note-placement-assigner-set';
import { AssignerLifter } from '@/types/modify-score/assigner';
import {
	MeasureAttributeAssigner,
	NotePlacementValidator,
} from '@/types/modify-score';
import {
	SegmentSelectionData,
	SelectionMetadata,
} from '@/types/modify-score/assigner/metadata';
import { getSegmentAssignerStructures } from '@/utils/music/modify-score/metadata-helpers';
import { MeasureAttributes } from '@/types/music';
import { curriedModifyMeasureAttribute } from '@/utils/music/modify-score/curried-assigners';
import StaticAttributesAssignerSet from './measure-attributes/sets/static-attributes-assigner-set';
import DynamicAttributeAssignerSet from './measure-attributes/sets/dynamic-attributes-assigner-set';

interface AssignerButtonRepoProps {
	selections: SegmentSelectionData[];
	notePlacementValidator: NotePlacementValidator;
	liftExecutor: AssignerLifter;
}

const AssignerButtonRepo: FunctionComponent<AssignerButtonRepoProps> = ({
	selections,
	notePlacementValidator,
	liftExecutor,
}) => {
	const { annotationMetadata, attributeMetadata, validPlacementTypes } =
		getSegmentAssignerStructures(selections, notePlacementValidator);

	const assigner: MeasureAttributeAssigner = (attribute, value) => {
		console.log({ attribute, value });

		if (!liftExecutor) return;

		liftExecutor(curriedModifyMeasureAttribute(attribute, value));
	};

	return (
		<>
			<LayoutList
				layoutProps={{
					'--list-item-width': 'minmax(200px, 1fr)',
					'--list-padding': '0',
					'--auto': 'auto-fit',
				}}
			>
				<NotePlacementAssignerSet
					liftExecuter={liftExecutor}
					validPlacementTypes={validPlacementTypes}
					notePlacementValidator={notePlacementValidator}
				/>
				<AnnotationsAssignerSet
					liftExecuter={liftExecutor}
					annotationMetadata={annotationMetadata || undefined}
				/>
				{/* <MeasureAttributeAssignerSet
					liftExecuter={liftExecutor}
					attributeMetadata={
						(attributeMetadata as SelectionMetadata<MeasureAttributes>) ||
						undefined
					}
				/> */}
			</LayoutList>
			<StaticAttributesAssignerSet
				attributeMetadata={
					attributeMetadata as SelectionMetadata<MeasureAttributes>
				}
				assigner={assigner}
			/>
			{/* <DynamicAttributeAssignerSet
				attributeMetadata={
					attributeMetadata as SelectionMetadata<MeasureAttributes>
				}
				assigner={assigner}
			/> */}
		</>
	);
};

export default AssignerButtonRepo;
