import { FunctionComponent } from 'react';
import classes from './AnnotationsAssignerButtonSet.module.css';
import AssignerButtonSet from '../assigner-button-set';
import AccentAssigner from './buttons/accent';
import { NoteAnnotationAssigner } from '@/types/modify-score';
import { useMusic } from '@/components/providers/music';
import { modifyNoteAnnotationAdapter } from '@/utils/music/modify-score/music-hook-helpers';
import DottedAssigner from './buttons/dotted';

interface AnnotationsAssignerButtonSetProps {
	selectedNote?: { measureIndex: number; noteIndex: number };
}

const AnnotationsAssignerButtonSet: FunctionComponent<
	AnnotationsAssignerButtonSetProps
> = ({ selectedNote }) => {
	const { invokeMeasureModifier } = useMusic();
	const annotationAssigner: NoteAnnotationAssigner = (key, value?) => {
		console.log({ key, value });

		if (selectedNote) {
			const { measureIndex, noteIndex } = selectedNote;
			invokeMeasureModifier(
				modifyNoteAnnotationAdapter(key, value, measureIndex, noteIndex)
			);
		}
	};

	return (
		<AssignerButtonSet>
			<AccentAssigner assigner={annotationAssigner} />
			<DottedAssigner assigner={annotationAssigner} />
		</AssignerButtonSet>
	);
};

export default AnnotationsAssignerButtonSet;
