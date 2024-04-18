import { FunctionComponent, useRef } from 'react';
import classes from './AssignerButtonRepo.module.css';
import LayoutList from '../layout/list';
import AnnotationsAssignerSet from './annotations/annotations-assigner-set';
import NotePlacementAssignerSet from './place-note/note-placement-assigner-set';
import MeasureAttributeAssignerSet from './measure-attributes/measure-attribute-assigner-set';
import {
	AssignerLifter,
	CurriedAssigner,
	SelectionData,
} from '@/types/modify-score/assigner';
import {
	getAnnotationSelectionMetadata,
	getAttributeSelectionMetadata,
	getValidNotePlacementTypes,
} from '@/utils/music/modify-score/assigner';
import { NotePlacementValidator } from '@/types/modify-score';

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
	// NOTE: Could make a single function to retrieve both - would be faster too
	const annotationMetadata = getAnnotationSelectionMetadata(selections);
	const attributeMetadata = getAttributeSelectionMetadata(selections);
	const validPlacementTypes = getValidNotePlacementTypes(
		selections,
		notePlacementValidator
	);

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
				attributeMetadata={attributeMetadata || undefined}
			/>
		</LayoutList>
	);
};

export default AssignerButtonRepo;
