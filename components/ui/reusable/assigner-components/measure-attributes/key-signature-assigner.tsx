import { FunctionComponent } from 'react';
import classes from './KeySignatureAssigner.module.css';
import AssignerDropdown from '../assigner-dropdown';
import { IAttributeAssignerComponent } from '@/types/modify-score/assigner';
import { getAssignValue } from '@/utils/music/modify-score/assigner';
import { MeasureAttributes } from '@/types/music';

const keySignatures: string[] = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db'];

interface KeySignatureAssignerProps
	extends IAttributeAssignerComponent<'keySignature'> {}

const KeySignatureAssigner: FunctionComponent<KeySignatureAssignerProps> = ({
	assigner,
	attributeMetadata,
}) => {
	const assignValue = getAssignValue<MeasureAttributes, 'keySignature'>(
		attributeMetadata
	);

	return (
		<AssignerDropdown
			onClick={(ksValue) => assigner('keySignature', parseInt(ksValue))}
			label="Key Signature"
			disabled={!attributeMetadata}
		>
			{keySignatures.map((sig, i) => {
				return { displayValue: sig, value: i.toString(), el: <p>{sig}</p> };
			})}
		</AssignerDropdown>
	);
};

export default KeySignatureAssigner;
