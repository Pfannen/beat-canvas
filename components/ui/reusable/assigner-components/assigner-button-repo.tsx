import { FunctionComponent } from 'react';
import LayoutList from '../layout/list';
import AnnotationsAssignerSet from './annotations/annotations-assigner-set';
import NotePlacementAssignerSet from './place-note/note-placement-assigner-set';
import MeasureAttributeAssignerSet from './measure-attributes/measure-attribute-assigner-set';
import { AssignerLifter } from '@/types/modify-score/assigner';
import {
	MeasureAttributeAssigner,
	NotePlacementValidator,
} from '@/types/modify-score';
import {
	SelectionData,
	SelectionMetadata,
} from '@/types/modify-score/assigner/metadata';
import { getAssignerStructures } from '@/utils/music/modify-score/metadata-helpers';
import { MeasureAttributes } from '@/types/music';
import StaticAttributesAssignerSet from './measure-attributes/static-attributes-assigner-set';
import { curriedModifyMeasureAttribute } from '@/utils/music/modify-score/curried-assigners';

interface AssignerButtonRepoProps {
	selections: SelectionData[];
	notePlacementValidator: NotePlacementValidator;
	liftExecutor: AssignerLifter;
}

const AssignerButtonRepo: FunctionComponent<AssignerButtonRepoProps> = ({
	selections,
	notePlacementValidator,
	liftExecutor,
}) => {
	const { annotationMetadata, attributeMetadata, validPlacementTypes } =
		getAssignerStructures(selections, notePlacementValidator);

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
				<MeasureAttributeAssignerSet
					liftExecuter={liftExecutor}
					attributeMetadata={
						(attributeMetadata as SelectionMetadata<MeasureAttributes>) ||
						undefined
					}
				/>
			</LayoutList>
			<StaticAttributesAssignerSet
				attributeMetadata={
					attributeMetadata as SelectionMetadata<MeasureAttributes>
				}
				assigner={assigner}
			/>
		</>
	);
};

export default AssignerButtonRepo;
