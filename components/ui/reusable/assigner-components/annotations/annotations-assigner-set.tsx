import { FunctionComponent } from 'react';
import classes from './AnnotationsAssignerSet.module.css';
import AssignerButtonSet from '../style/assigner-button-set';
import AccentAssigner from './buttons/accent';
import { NoteAnnotationAssigner } from '@/types/modify-score';
import { useMusic } from '@/components/providers/music';
import {
	curriedModifyNoteAnnotation,
	modifyNoteAnnotationAdapter,
} from '@/utils/music/modify-score/music-hook-helpers';
import DottedAssigner from './buttons/dotted';
import { AssignerLifter, SelectionData } from '@/types/modify-score/assigner';

interface AnnotationsAssignerSetProps {
	liftExecuter?: AssignerLifter;
	selectedNote?: { measureIndex: number; noteIndex: number };
}

const AnnotationsAssignerSet: FunctionComponent<
	AnnotationsAssignerSetProps
> = ({ liftExecuter, selectedNote }) => {
	const annotationAssigner: NoteAnnotationAssigner = (key, value?) => {
		console.log({ key, value });

		if (!selectedNote) return;
		if (liftExecuter) {
			liftExecuter(curriedModifyNoteAnnotation(key, value));
		} else {
			console.log('Do not have a lift executor for ' + { key, value });
		}
	};

	return (
		<AssignerButtonSet title={'Note Annotations'}>
			<AccentAssigner assigner={annotationAssigner} />
			<DottedAssigner assigner={annotationAssigner} />
		</AssignerButtonSet>
	);
};

export default AnnotationsAssignerSet;
