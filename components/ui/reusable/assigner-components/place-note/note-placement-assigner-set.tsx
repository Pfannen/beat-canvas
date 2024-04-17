import { FunctionComponent } from 'react';
import AssignerButtonSet from '../style/assigner-button-set';
import NotePlacementAssigner from './buttons/note-placement-assigner';
import QuarterNoteSVG from '@/components/ui/svg/notes/quarter-note';
import { AssignerLifter } from '@/types/modify-score/assigner';
import { NoteType } from '@/components/providers/music/types';
import EighthNoteSVG from '@/components/ui/svg/notes/eigth-note';
import WholeNoteSVG from '@/components/ui/svg/notes/whole-note';
import HalfNoteSVG from '@/components/ui/svg/notes/half-note';
import SixteenthNoteSVG from '@/components/ui/svg/notes/sixteenth-note';
import { curriedPlaceNote } from '@/utils/music/modify-score/music-hook-helpers';
import { NotePlacementValidator } from '@/types/modify-score';

interface NotePlacementAssignerSetProps {
	liftExecuter?: AssignerLifter;
	validPlacementTypes: Set<NoteType>;
	notePlacementValidator: NotePlacementValidator;
}

const NotePlacementAssignerSet: FunctionComponent<
	NotePlacementAssignerSetProps
> = ({ liftExecuter, validPlacementTypes: vPT, notePlacementValidator }) => {
	const assigner = (noteType: NoteType, placeNote?: boolean) => {
		console.log({ noteType });

		if (!liftExecuter) return;

		liftExecuter(
			curriedPlaceNote(noteType, placeNote ? notePlacementValidator : undefined)
		);
	};

	return (
		<AssignerButtonSet title="Note Placement">
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
	);
};

export default NotePlacementAssignerSet;
