import { FunctionComponent } from 'react';
import classes from './note-placement-assigner-set.module.css';
import AssignerButtonSet from '../style/assigner-button-set';
import NotePlacementAssigner from './buttons/note-placement-assigner';
import QuarterNoteSVG from '@/components/ui/svg/notes/quarter-note';
import {
	AssignerLifter,
	ValidNotePlacements,
} from '@/types/modify-score/assigner';
import { NoteType } from '@/components/providers/music/types';
import EighthNoteSVG from '@/components/ui/svg/notes/eigth-note';
import WholeNoteSVG from '@/components/ui/svg/notes/whole-note';
import HalfNoteSVG from '@/components/ui/svg/notes/half-note';
import SixteenthNoteSVG from '@/components/ui/svg/notes/sixteenth-note';
import { curriedPlaceNote } from '@/utils/music/modify-score/curried-assigners';
import { NotePlacementValidator } from '@/types/modify-score';

interface NotePlacementAssignerSetProps {
	liftExecuter?: AssignerLifter;
	validPlacementTypes: ValidNotePlacements;
	notePlacementValidator: NotePlacementValidator;
}

const NotePlacementAssignerSet: FunctionComponent<
	NotePlacementAssignerSetProps
> = ({ liftExecuter, validPlacementTypes: vPT, notePlacementValidator }) => {
	const assigner = (noteType: NoteType, placeNote?: boolean) => {
		console.log({ placeNote, noteType });

		if (!liftExecuter) return;

		liftExecuter(
			curriedPlaceNote(noteType, placeNote ? notePlacementValidator : undefined)
		);
	};

	return (
		<div className={classes.notes_container}>
			<AssignerButtonSet title="Notes">
				<NotePlacementAssigner
					assigner={assigner}
					noteType="whole"
					disabled={!vPT.has('whole')}
				>
					<WholeNoteSVG />
				</NotePlacementAssigner>
				<NotePlacementAssigner
					assigner={assigner}
					noteType="half"
					disabled={!vPT.has('half')}
				>
					<HalfNoteSVG />
				</NotePlacementAssigner>
				<NotePlacementAssigner
					assigner={assigner}
					noteType="quarter"
					disabled={!vPT.has('quarter')}
				>
					<QuarterNoteSVG />
				</NotePlacementAssigner>
				<NotePlacementAssigner
					assigner={assigner}
					noteType="eighth"
					disabled={!vPT.has('eighth')}
				>
					<EighthNoteSVG />
				</NotePlacementAssigner>
				<NotePlacementAssigner
					assigner={assigner}
					noteType="sixteenth"
					disabled={!vPT.has('sixteenth')}
				>
					<SixteenthNoteSVG />
				</NotePlacementAssigner>
			</AssignerButtonSet>
			<div className={classes.remove_btn_container}>
				<NotePlacementAssigner assigner={assigner} disabled={!vPT.has('r')}>
					Remove
				</NotePlacementAssigner>
			</div>
		</div>
	);
};

export default NotePlacementAssignerSet;
