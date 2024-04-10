import { FunctionComponent } from 'react';
import classes from './DottedAssigner.module.css';
import { INoteAnnotationAssignerButton } from '@/types/modify-score/assigner';
import ModifyMusicAssigner from '../../style/modify-music-assigner-button';
import DottedSVG from '@/components/ui/svg/annotations/dotted-svg';
import { getAssignValue } from '@/utils/music/modify-score/assigner';
import { NoteAnnotations } from '@/types/music/note-annotations';

interface DottedAssignerProps extends INoteAnnotationAssignerButton<'dotted'> {}

const DottedAssigner: FunctionComponent<DottedAssignerProps> = ({
	assigner,
	selectionMetadata,
}) => {
	const assignValue = getAssignValue<NoteAnnotations, 'dotted'>(
		selectionMetadata
	);

	return (
		<ModifyMusicAssigner
			onClick={() => assigner('dotted', assignValue)}
			active={!!selectionMetadata}
		>
			<DottedSVG />
		</ModifyMusicAssigner>
	);
};

export default DottedAssigner;
