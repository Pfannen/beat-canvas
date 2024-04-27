import { FunctionComponent } from 'react';
import classes from './KeySignatureAssigner.module.css';
import AssignerDropdown from '../assigner-dropdown';
import {
	IAttributeAssignerComponent,
	IKnownGenericAssignerComponent,
} from '@/types/modify-score/assigner';
import { getAssignValue } from '@/utils/music/modify-score/metadata-helpers';
import { MeasureAttributes } from '@/types/music';

const keySignatures: string[] = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db'];

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
		>
			{keySignatures.map((sig, i) => {
				return { displayValue: sig, value: i, el: <p>{sig}</p> };
			})}
		</AssignerDropdown>
	);
};

export default KeySignatureAssigner;
