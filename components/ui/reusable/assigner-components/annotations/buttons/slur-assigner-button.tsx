import { FunctionComponent } from 'react';
import classes from './SlurAssignerButton.module.css';
import { IKnownGenericAssignerComponent } from '@/types/modify-score/assigner';
import {
	NoteAnnotation,
	NoteAnnotations,
	Slur,
} from '@/types/music/note-annotations';
import ModifyMusicAssigner from '../../style/modify-music-assigner-button';
import SlurSVG from '@/components/ui/svg/annotations/slur-svg';

interface SlurAssignerButtonProps
	extends IKnownGenericAssignerComponent<NoteAnnotations, 'slur'> {}

// NOTE: Assigning slurs is a unique case, so it has its own assigner button and not a generic one
const SlurAssignerButton: FunctionComponent<SlurAssignerButtonProps> = ({
	assigner,
	metadataEntry,
}) => {
	let assignValue: Slur | undefined;
	if (metadataEntry) {
		if (metadataEntry.allSelectionsHave) {
			assignValue = metadataEntry.value ? undefined : {};
		} else assignValue = {};
	}

	return (
		<ModifyMusicAssigner
			onClick={() => assigner('slur', assignValue)}
			disabled={!metadataEntry}
			add={!!assignValue}
		>
			<SlurSVG />
		</ModifyMusicAssigner>
	);
};

export default SlurAssignerButton;
