import { FunctionComponent } from 'react';
import classes from './AssignerButtonRepo.module.css';
import LayoutList from '../layout/list';
import AnnotationsAssignerButtonSet from './annotations/annotations-assigner-button-set';
import NotePlacementAssignerButtonSet from './place-note/note-placement-assigner-button-set';

interface AssignerButtonRepoProps {}

const AssignerButtonRepo: FunctionComponent<AssignerButtonRepoProps> = () => {
	return (
		<LayoutList>
			<NotePlacementAssignerButtonSet />
			<AnnotationsAssignerButtonSet />
		</LayoutList>
	);
};

export default AssignerButtonRepo;
