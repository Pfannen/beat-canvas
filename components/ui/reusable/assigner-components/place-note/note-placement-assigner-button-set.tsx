import { FunctionComponent } from 'react';
import classes from './NotePlacementAssignerButtonSet.module.css';
import AssignerButtonSet from '../assigner-button-set';
import NotePlacementAssigner from './buttons/note-placement-assigner';
import QuarterNoteSVG from '@/components/ui/svg/notes/quarter-note';
import {
	ExecuteAssignerDelegate,
	PlacementData,
} from '@/types/modify-score/assigner';
import { useMusic } from '@/components/providers/music';
import { Note, NoteType } from '@/components/providers/music/types';
import { addNote } from '@/components/providers/music/hooks/useMeasures/utils';
import EighthNoteSVG from '@/components/ui/svg/notes/eigth-note';

interface NotePlacementAssignerButtonSetProps {
	liftExecuter?: ExecuteAssignerDelegate;
}

const NotePlacementAssignerButtonSet: FunctionComponent<
	NotePlacementAssignerButtonSetProps
> = ({ liftExecuter }) => {
	const { invokeMeasureModifier } = useMusic();

	const assigner = (noteType: NoteType) => {
		console.log({ noteType });

		if (!liftExecuter) return;

		const executeThis = (placementData: PlacementData) => {
			const { measureIndex, x, y } = placementData;
			const note: Note = {
				x,
				y,
				type: noteType,
			};

			invokeMeasureModifier(addNote({ note, measureIndex }));
			return true;
		};
		liftExecuter(executeThis);
	};

	return (
		<AssignerButtonSet>
			<NotePlacementAssigner assigner={assigner} noteType="quarter">
				<QuarterNoteSVG />
			</NotePlacementAssigner>
			<NotePlacementAssigner assigner={assigner} noteType="eighth">
				<EighthNoteSVG />
			</NotePlacementAssigner>
		</AssignerButtonSet>
	);
};

export default NotePlacementAssignerButtonSet;
