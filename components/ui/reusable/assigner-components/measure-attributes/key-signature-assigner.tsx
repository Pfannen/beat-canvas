import { FunctionComponent } from 'react';
import classes from './KeySignatureAssigner.module.css';
import AssignerDropdown, {
	AssignerDropdownItemDisplay,
} from '../assigner-dropdown';
import {
	IAttributeAssignerComponent,
	IKnownGenericAssignerComponent,
} from '@/types/modify-score/assigner';
import { getAssignValue } from '@/utils/music/modify-score/metadata-helpers';
import { MeasureAttributes } from '@/types/music';

const keySignatureDisplay: AssignerDropdownItemDisplay<number>[] = [
	{ displayValue: 'Gb', value: -6, el: <p>Gb</p> },
	{ displayValue: 'Db', value: -5, el: <p>Db</p> },
	{ displayValue: 'Ab', value: -4, el: <p>Ab</p> },
	{ displayValue: 'Eb', value: -3, el: <p>Eb</p> },
	{ displayValue: 'Bb', value: -2, el: <p>Bb</p> },
	{ displayValue: 'F', value: -1, el: <p>F</p> },
	{ displayValue: 'C', value: 0, el: <p>C</p> },
	{ displayValue: 'G', value: 1, el: <p>G</p> },
	{ displayValue: 'D', value: 2, el: <p>D</p> },
	{ displayValue: 'A', value: 3, el: <p>A</p> },
	{ displayValue: 'E', value: 4, el: <p>E</p> },
	{ displayValue: 'B', value: 5, el: <p>P</p> },
];

interface KeySignatureAssignerProps
	extends IKnownGenericAssignerComponent<MeasureAttributes, 'keySignature'> {}

const KeySignatureAssigner: FunctionComponent<KeySignatureAssignerProps> = ({
	assigner,
	metadataEntry,
}) => {
	return (
		<AssignerDropdown<MeasureAttributes, 'keySignature'>
			tKey={'keySignature'}
			assigner={assigner}
			label="Key Signature"
			metadataEntry={metadataEntry}
			defaultSelectedIdx={6}
		>
			{keySignatureDisplay as []}
		</AssignerDropdown>
	);
};

export default KeySignatureAssigner;

// For reference
/* const keySignatures: { note: string; fifth: number }[] = [
	{ note: 'Db', fifth: -5 },
	{ note: 'Ab', fifth: -4 },
	{ note: 'Eb', fifth: -3 },
	{ note: 'Bb', fifth: -2 },
	{ note: 'F', fifth: -1 },
	{ note: 'C', fifth: 0 },
	{ note: 'G', fifth: 1 },
	{ note: 'D', fifth: 2 },
	{ note: 'A', fifth: 3 },
	{ note: 'E', fifth: 4 },
	{ note: 'B', fifth: 5 },
]; */
