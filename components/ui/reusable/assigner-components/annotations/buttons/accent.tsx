import { FunctionComponent } from 'react';
import classes from './AccentAssigner.module.css';
import { IAnnotationAssignerComponent } from '@/types/modify-score/assigner';
import ModifyMusicAssigner from '../../style/modify-music-assigner-button';
import AccentSVG from '@/components/ui/svg/annotations/accent-svg';
import { getAssignValue } from '@/utils/music/modify-score/assigner';
import {
	NoteAnnotation,
	NoteAnnotations,
} from '@/types/music/note-annotations';

interface AccentAssignerProps extends IAnnotationAssignerComponent<'accent'> {}

const AccentAssigner: FunctionComponent<AccentAssignerProps> = ({
	assigner,
	annotationMetadata,
}) => {
	const assignValue = getAssignValue<NoteAnnotations, 'accent'>(
		annotationMetadata,
		'strong'
	);

	return (
		<ModifyMusicAssigner
			onClick={() => assigner('accent', assignValue)}
			disabled={!annotationMetadata}
			add={!!assignValue}
		>
			<AccentSVG />
		</ModifyMusicAssigner>
	);
};

export default AccentAssigner;
