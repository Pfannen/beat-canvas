import { FunctionComponent } from 'react';
import AssignerButtonSet from '../style/assigner-button-set';
import dropdownClasses from '../style/assigner-dropdowns.module.css';
import { NoteAnnotationAssigner } from '@/types/modify-score';
import { curriedModifyNoteAnnotation } from '@/utils/music/modify-score/curried-assigners';
import { AssignerLifter } from '@/types/modify-score/assigner';
import { NoteAnnotations } from '@/types/music/note-annotations';
import { SelectionMetadata } from '@/types/modify-score/assigner/metadata';
import AnnotationAssignerButton from './buttons/annotation-assigner-button';
import AccentSVG from '@/components/ui/svg/annotations/accent-svg';
import DottedSVG from '@/components/ui/svg/annotations/dotted-svg';
import SlurAssignerButton from './buttons/slur-assigner-button';
import StaccatoSVG from '@/components/ui/svg/annotations/staccato-svg';

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
		<div style={{ width: '100%' }}>
			<AssignerButtonSet title={'Note Annotations'}>
				<AnnotationAssignerButton<'accent'>
					tKey="accent"
					assigner={annotationAssigner}
					metadataEntry={annotationMetadata?.accent}
				>
					<AccentSVG />
				</AnnotationAssignerButton>
				<AnnotationAssignerButton<'dotted'>
					tKey="dotted"
					assigner={annotationAssigner}
					metadataEntry={annotationMetadata?.dotted}
				>
					<DottedSVG />
				</AnnotationAssignerButton>
				<AnnotationAssignerButton<'staccato'>
					tKey="staccato"
					assigner={annotationAssigner}
					metadataEntry={annotationMetadata?.staccato}
				>
					<StaccatoSVG />
				</AnnotationAssignerButton>
				<SlurAssignerButton
					assigner={annotationAssigner}
					metadataEntry={annotationMetadata?.slur}
				/>
			</AssignerButtonSet>
			<div className={dropdownClasses.dropdown}></div>
		</div>
	);
};

export default AnnotationsAssignerSet;
