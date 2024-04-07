import { FunctionComponent } from 'react';
import classes from './AnnotationsAssignerButtonSet.module.css';
import AssignerButtonSet from '../assigner-button-set';
import AccentAssigner from './buttons/accent';
import { NoteAnnotationAssigner } from '@/types/modify-score';
import { useMusic } from '@/components/providers/music';
import { modifyNoteAnnotationAdapter } from '@/utils/music/modify-score/music-hook-helpers';
import DottedAssigner from './buttons/dotted';
import {
	ExecuteAssignerDelegate,
	PlacementData,
} from '@/types/modify-score/assigner';

interface AnnotationsAssignerButtonSetProps {
	liftExecuter?: ExecuteAssignerDelegate;
	selectedNote?: { measureIndex: number; noteIndex: number };
}

const AnnotationsAssignerButtonSet: FunctionComponent<
	AnnotationsAssignerButtonSetProps
> = ({ liftExecuter, selectedNote }) => {
	const { invokeMeasureModifier } = useMusic();
	
	const annotationAssigner: NoteAnnotationAssigner = (key, value?) => {
		console.log({ key, value });

		if (!selectedNote) return;
		if (liftExecuter) {
			const executeThis = (placementData: PlacementData) => {
				invokeMeasureModifier(
					modifyNoteAnnotationAdapter(
						key,
						value,
						placementData.measureIndex,
						selectedNote.noteIndex
					)
				);
				return true;
			};
			liftExecuter(executeThis);
		} else {
			invokeMeasureModifier(
				modifyNoteAnnotationAdapter(
					key,
					value,
					selectedNote.measureIndex,
					selectedNote.noteIndex
				)
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
