import { FunctionComponent, useRef, useState } from 'react';
import classes from './TimeSignatureAssigner.module.css';
import AssignerInputLayout from '../style/assigner-input-layout';
import AssignerInputField from '../style/assigner-input-field';
import { MeasureAttributes, numberNoteTypes } from '@/types/music';
import ModifyMusicAssigner from '../style/modify-music-assigner-button';
import AssignerDropdownField from '../style/assigner-dropdown-field';
import {
	IAttributeAssignerComponent,
	IKnownGenericAssignerComponent,
} from '@/types/modify-score/assigner';
import { getAssignValue } from '@/utils/music/modify-score/assigner';

interface TimeSignatureAssignerProps
	extends IKnownGenericAssignerComponent<MeasureAttributes, 'timeSignature'> {}

const TimeSignatureAssigner: FunctionComponent<TimeSignatureAssignerProps> = ({
	assigner,
	metadataEntry,
}) => {
	const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
	const [beatNote, setBeatNote] = useState(4);
	const inputRef = useRef<HTMLInputElement>(null);

	const assignValue = getAssignValue<MeasureAttributes, 'timeSignature'>(
		{ beatNote: 4, beatsPerMeasure: 4 },
		metadataEntry
	);

	return (
		<AssignerInputLayout>
			<label htmlFor="per-measure">Time Signature: </label>
			<div>
				<AssignerInputField
					type="number"
					id="per-measure"
					onChange={(e) => {
						let num = parseInt(e.target.value);
						if (isNaN(num)) return;
						num = Math.min(99, num);
						num = Math.max(1, num);
						inputRef.current!.value = num.toString();
					}}
					onBlur={() => {
						let num = parseInt(inputRef.current!.value);
						if (isNaN(num)) {
							num = 4;
							inputRef.current!.value = num.toString();
						}
						if (beatsPerMeasure !== num) setBeatsPerMeasure(num);
					}}
					defaultValue={4}
					min="1"
					max="99"
					ref1={inputRef}
					disabled={!metadataEntry}
				/>{' '}
				/{' '}
				<AssignerDropdownField
					onChange={(e) => setBeatNote(parseInt(e.target.value))}
					defaultValue={4}
					disabled={!metadataEntry}
				>
					{
						numberNoteTypes.map((num) => ({
							value: num,
							displayValue: num,
						})) as [] // makes ts stop complaining
					}
				</AssignerDropdownField>
			</div>
			<ModifyMusicAssigner
				onClick={() =>
					assigner('timeSignature', {
						beatNote: beatNote,
						beatsPerMeasure: beatsPerMeasure,
					})
				}
				disabled={!metadataEntry}
				add={!!assignValue}
			>
				<p style={{ display: 'inline' }}>{beatsPerMeasure}</p>/
				<p style={{ display: 'inline' }}>{beatNote}</p>
			</ModifyMusicAssigner>
		</AssignerInputLayout>
	);
};

export default TimeSignatureAssigner;
