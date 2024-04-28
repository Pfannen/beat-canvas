import { FunctionComponent } from 'react';
import classes from './AnnotationAssignerButton.module.css';
import { IAnnotationAssignerComponent } from '@/types/modify-score/assigner';
import { NoteAnnotations } from '@/types/music/note-annotations';
import ModifyMusicAssigner from '../../style/modify-music-assigner-button';
import { getAssignValue } from '@/utils/music/modify-score/metadata-helpers';
import { defaultAnnotationValues } from '@/utils/music/modify-score/metadata-helpers/annotations';

const defaults = defaultAnnotationValues;

// There's a lot of generic passing here, but ultimately the functional component definition
// will pass the note annotation key to the interface
interface AnnotationAssignerButtonProps<T extends keyof NoteAnnotations>
	extends IAnnotationAssignerComponent<T> {}

const AnnotationAssignerButton = <K extends keyof NoteAnnotations>({
	assigner,
	tKey: key,
	metadataEntry,
	children,
	currentValue,
}: AnnotationAssignerButtonProps<K>): JSX.Element => {
	const assignValue = getAssignValue<NoteAnnotations, K>(
		currentValue || defaults[key],
		metadataEntry
	);

	return (
		<ModifyMusicAssigner
			onClick={() => assigner(key, assignValue)}
			disabled={!metadataEntry}
			add={!!assignValue}
		>
			{children}
		</ModifyMusicAssigner>
	);
};

export default AnnotationAssignerButton;
