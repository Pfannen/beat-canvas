import { FunctionComponent } from 'react';
import classes from './NotePlacementAssignerSet.module.css';
import AssignerButtonSet from '../style/assigner-button-set';
import NotePlacementAssigner from './buttons/note-placement-assigner';
import QuarterNoteSVG from '@/components/ui/svg/notes/quarter-note';
import { AssignerLifter, SelectionData } from '@/types/modify-score/assigner';
import { useMusic } from '@/components/providers/music';
import { Note, NoteType } from '@/components/providers/music/types';
import { addNote } from '@/components/providers/music/hooks/useMeasures/utils';
import EighthNoteSVG from '@/components/ui/svg/notes/eigth-note';
import WholeNoteSVG from '@/components/ui/svg/notes/whole-note';
import HalfNoteSVG from '@/components/ui/svg/notes/half-note';
import SixteenthNoteSVG from '@/components/ui/svg/notes/sixteenth-note';
import { curriedPlaceNote } from '@/utils/music/modify-score/music-hook-helpers';

interface NotePlacementAssignerSetProps {
	liftExecuter?: AssignerLifter;
}

const NotePlacementAssignerSet: FunctionComponent<
	NotePlacementAssignerSetProps
> = ({ liftExecuter }) => {
	const assigner = (noteType: NoteType, placeNote?: boolean) => {
		console.log({ noteType });

		if (!liftExecuter) return;

		// TODO: Pass in actual note placement validator
		liftExecuter(
			curriedPlaceNote(noteType, placeNote ? () => true : undefined)
		);
	};

	return (
		<AssignerButtonSet title="Note Placement">
			<NotePlacementAssigner assigner={assigner} noteType="whole">
				<WholeNoteSVG />
			</NotePlacementAssigner>
			<NotePlacementAssigner assigner={assigner} noteType="half">
				<HalfNoteSVG />
			</NotePlacementAssigner>
			<NotePlacementAssigner assigner={assigner} noteType="quarter">
				<QuarterNoteSVG />
			</NotePlacementAssigner>
			<NotePlacementAssigner assigner={assigner} noteType="eighth">
				<EighthNoteSVG />
			</NotePlacementAssigner>
			<NotePlacementAssigner assigner={assigner} noteType="sixteenth">
				<SixteenthNoteSVG />
			</NotePlacementAssigner>
		</AssignerButtonSet>
	);
};

export default NotePlacementAssignerSet;
