import { FunctionComponent } from 'react';
import classes from './AnnotationAssignerButton.module.css';
import {
	IAnnotationAssignerComponent,
	IAnnotationAssignerComponent2,
} from '@/types/modify-score/assigner';
import { NoteAnnotations } from '@/types/music/note-annotations';
import ModifyMusicAssigner from '../../style/modify-music-assigner-button';
import {
	defaultAnnotationValues,
	getAssignValue,
} from '@/utils/music/modify-score/assigner';

const defaults = defaultAnnotationValues;

// There's a lot of generic passing here, but ultimately the functional component definition
// will pass the note annotation key to the interface
interface AnnotationAssignerButtonProps<T extends keyof NoteAnnotations>
	extends IAnnotationAssignerComponent2<T> {}

const AnnotationAssignerButton = <T extends keyof NoteAnnotations>({
	assigner,
	annotationName,
	metadataEntry,
	children,
}: AnnotationAssignerButtonProps<T>): JSX.Element => {
	const assignValue = getAssignValue<NoteAnnotations, T>(
		metadataEntry,
		defaults[annotationName]
	);

	return (
		<ModifyMusicAssigner
			onClick={() => assigner(annotationName, assignValue)}
			disabled={!metadataEntry}
			add={!!assignValue}
		>
			{children}
		</ModifyMusicAssigner>
	);
};

export default AnnotationAssignerButton;
