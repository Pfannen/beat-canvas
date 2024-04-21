import { FunctionComponent } from 'react';
import AssignerButtonSet from '../style/assigner-button-set';
import dropdownClasses from '../style/assigner-dropdowns.module.css';
import AccentAssigner from './buttons/accent';
import { NoteAnnotationAssigner } from '@/types/modify-score';
import { curriedModifyNoteAnnotation } from '@/utils/music/modify-score/music-hook-helpers';
import DottedAssigner from './buttons/dotted';
import { AssignerLifter } from '@/types/modify-score/assigner';
import { NoteAnnotations } from '@/types/music/note-annotations';
import { SelectionMetadata } from '@/types/modify-score/assigner/metadata';
import AnnotationAssignerButton from './buttons/annotation-assigner-button';
import AccentSVG from '@/components/ui/svg/annotations/accent-svg';
import DottedSVG from '@/components/ui/svg/annotations/dotted-svg';

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
					annotationName="accent"
					assigner={annotationAssigner}
					metadataEntry={annotationMetadata?.accent}
				>
					<AccentSVG />
				</AnnotationAssignerButton>
				<AnnotationAssignerButton<'dotted'>
					annotationName="dotted"
					assigner={annotationAssigner}
					metadataEntry={annotationMetadata?.dotted}
				>
					<DottedSVG />
				</AnnotationAssignerButton>
				<AnnotationAssignerButton<'slur'>
					annotationName="slur"
					assigner={annotationAssigner}
					metadataEntry={annotationMetadata?.slur}
				>
					<p>Sl</p>
				</AnnotationAssignerButton>
				<AnnotationAssignerButton<'staccato'>
					annotationName="staccato"
					assigner={annotationAssigner}
					metadataEntry={annotationMetadata?.staccato}
				>
					<p>St</p>
				</AnnotationAssignerButton>
			</AssignerButtonSet>
			<div className={dropdownClasses.dropdown}></div>
		</div>
	);
};

export default AnnotationsAssignerSet;
