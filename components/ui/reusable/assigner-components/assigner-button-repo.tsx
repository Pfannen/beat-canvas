import { FunctionComponent } from 'react';
import LayoutList from '../layout/list';
import AnnotationsAssignerSet from './annotations/annotations-assigner-set';
import NotePlacementAssignerSet from './place-note/note-placement-assigner-set';
import MeasureAttributeAssignerSet from './measure-attributes/measure-attribute-assigner-set';
import { AssignerLifter } from '@/types/modify-score/assigner';
import { NotePlacementValidator } from '@/types/modify-score';
import {
	SelectionData,
	SelectionMetadata,
} from '@/types/modify-score/assigner/metadata';
import { getAssignerStructures } from '@/utils/music/modify-score/metadata-helpers';
import { MeasureAttributes } from '@/types/music';

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

	return (
		<LayoutList
			layoutProps={{
				'--list-item-width': 'minmax(200px, 1fr)',
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
	);
};

export default AssignerButtonRepo;
