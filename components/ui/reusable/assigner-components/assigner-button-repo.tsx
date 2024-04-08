import { FunctionComponent, useRef } from 'react';
import classes from './AssignerButtonRepo.module.css';
import LayoutList from '../layout/list';
import AnnotationsAssignerSet from './annotations/annotations-assigner-set';
import NotePlacementAssignerSet from './place-note/note-placement-assigner-set';
import MeasureAttributeAssignerSet from './measure-attributes/measure-attribute-assigner-set';
import {
	ExecuteAssignerDelegate,
	PlacementData,
} from '@/types/modify-score/assigner';

interface AssignerButtonRepoProps {}

const AssignerButtonRepo: FunctionComponent<AssignerButtonRepoProps> = () => {
	const delegateRef = useRef<(p: PlacementData) => boolean>();

	const liftExecuter: ExecuteAssignerDelegate = (assigner) => {
		console.log('Execute this method: ' + assigner);
		delegateRef.current = assigner;
	};

	return (
		<LayoutList
			layoutProps={{
				'--list-item-width': 'minmax(200px, 1fr)',
			}}
		>
			<NotePlacementAssignerSet liftExecuter={liftExecuter} />
			<AnnotationsAssignerSet liftExecuter={liftExecuter} />
			<MeasureAttributeAssignerSet liftExecuter={liftExecuter} />
		</LayoutList>
	);
};

export default AssignerButtonRepo;
