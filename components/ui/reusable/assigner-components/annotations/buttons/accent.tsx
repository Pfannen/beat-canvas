import { FunctionComponent } from 'react';
import classes from './AccentAssigner.module.css';
import { INoteAnnotationAssignerButton } from '@/types/modify-score/assigner';
import ModifyMusicAssigner from '../../style/modify-music-assigner-button';
import AccentSVG from '@/components/ui/svg/annotations/accent-svg';
import { getAssignValue } from '@/utils/music/modify-score/assigner';
import {
	NoteAnnotation,
	NoteAnnotations,
} from '@/types/music/note-annotations';

interface AccentAssignerProps extends INoteAnnotationAssignerButton<'accent'> {}

const AccentAssigner: FunctionComponent<AccentAssignerProps> = ({
	assigner,
	selectionMetadata,
}) => {
	const assignValue = getAssignValue<NoteAnnotations, 'accent'>(
		selectionMetadata
	);

	return (
		<ModifyMusicAssigner
			onClick={() => assigner('accent', assignValue)}
			active={!!selectionMetadata}
		>
			<AccentSVG />
		</ModifyMusicAssigner>
	);
};

export default AccentAssigner;
