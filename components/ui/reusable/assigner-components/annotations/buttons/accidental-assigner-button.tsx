import { FunctionComponent, ReactNode } from 'react';
import classes from './AccidentalAssignerButton.module.css';
import { IKnownGenericAssignerComponent } from '@/types/modify-score/assigner';
import { NoteAnnotations } from '@/types/music/note-annotations';
import ModifyMusicAssigner from '../../style/modify-music-assigner-button';
import { getAssignValue } from '@/utils/music/modify-score/metadata-helpers';
import AnnotationAssignerButton from './annotation-assigner-button';
import { Accidental } from '@/types/music';
import FlatSVG from '@/components/ui/svg/annotations/flat-svg';
import NaturalSVG from '@/components/ui/svg/annotations/natural-svg';
import SharpSVG from '@/components/ui/svg/annotations/sharp-svg';

const accidentalSVGMap: { [key in Accidental]: ReactNode } = {
	b: <FlatSVG />,
	'#': <SharpSVG />,
	n: <NaturalSVG />,
};

interface AccidentalAssignerButtonProps
	extends IKnownGenericAssignerComponent<NoteAnnotations, 'accidental'> {
	accidental: Accidental;
}

const AccidentalAssignerButton = ({
	assigner,
	metadataEntry,
	accidental,
}: AccidentalAssignerButtonProps): JSX.Element => {
	return (
		<AnnotationAssignerButton<'accidental'>
			tKey="accidental"
			assigner={assigner}
			metadataEntry={metadataEntry}
			currentValue={accidental}
		>
			{accidentalSVGMap[accidental]}
		</AnnotationAssignerButton>
	);
};

export default AccidentalAssignerButton;
