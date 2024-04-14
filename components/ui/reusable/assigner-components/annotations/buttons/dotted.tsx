import { FunctionComponent } from 'react';
import classes from './DottedAssigner.module.css';
import { IAnnotationAssignerComponent } from '@/types/modify-score/assigner';
import ModifyMusicAssigner from '../../style/modify-music-assigner-button';
import DottedSVG from '@/components/ui/svg/annotations/dotted-svg';
import { getAssignValue } from '@/utils/music/modify-score/assigner';
import { NoteAnnotations } from '@/types/music/note-annotations';

interface DottedAssignerProps extends IAnnotationAssignerComponent<'dotted'> {}

const DottedAssigner: FunctionComponent<DottedAssignerProps> = ({
	assigner,
	annotationMetadata,
}) => {
	const assignValue = getAssignValue<NoteAnnotations, 'dotted'>(
		annotationMetadata
	);

	return (
		<ModifyMusicAssigner
			onClick={() => assigner('dotted', assignValue)}
			disabled={!annotationMetadata}
			add={!!assignValue}
		>
			<DottedSVG />
		</ModifyMusicAssigner>
	);
};

export default DottedAssigner;
