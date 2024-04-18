import { FunctionComponent } from 'react';
import AssignerButtonSet from '../style/assigner-button-set';
import AccentAssigner from './buttons/accent';
import { NoteAnnotationAssigner } from '@/types/modify-score';
import { curriedModifyNoteAnnotation } from '@/utils/music/modify-score/music-hook-helpers';
import DottedAssigner from './buttons/dotted';
import {
	AssignerLifter,
	SelectionMetadata,
} from '@/types/modify-score/assigner';
import { NoteAnnotations } from '@/types/music/note-annotations';

interface AnnotationsAssignerSetProps {
	liftExecuter?: AssignerLifter;
	annotationMetadata?: SelectionMetadata<NoteAnnotations>;
}

const AnnotationsAssignerSet: FunctionComponent<
	AnnotationsAssignerSetProps
> = ({ liftExecuter, annotationMetadata }) => {
	const annotationAssigner: NoteAnnotationAssigner = (key, value?) => {
		console.log({ apply: !!value, key, value });

		if (liftExecuter) {
			liftExecuter(curriedModifyNoteAnnotation(key, value));
		} else {
			console.log('Do not have a lift executor for ' + { key, value });
		}
	};

	return (
		<AssignerButtonSet title={'Note Annotations'}>
			<AccentAssigner
				assigner={annotationAssigner}
				annotationMetadata={annotationMetadata?.accent}
			/>
			<DottedAssigner
				assigner={annotationAssigner}
				annotationMetadata={annotationMetadata?.dotted}
			/>
		</AssignerButtonSet>
	);
};

export default AnnotationsAssignerSet;
