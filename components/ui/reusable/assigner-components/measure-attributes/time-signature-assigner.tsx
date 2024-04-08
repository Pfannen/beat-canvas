import { FunctionComponent, useRef, useState } from 'react';
import classes from './TimeSignatureAssigner.module.css';
import AssignerInputLayout from '../style/assigner-input-layout';
import AssignerInputField from '../style/assigner-input-field';
import { numberNoteTypes } from '@/types/music';
import ModifyMusicAssigner from '../style/modify-music-assigner-button';

interface TimeSignatureAssignerProps {
	onClick: (beatsPerMeasure: number, beatNote: number) => void;
}

const TimeSignatureAssigner: FunctionComponent<TimeSignatureAssignerProps> = ({
	onClick,
}) => {
	const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
	const [beatNote, setBeatNote] = useState(4);
	const inputRef = useRef<HTMLInputElement>(null);

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
				/>{' '}
				/{' '}
				<select
					onChange={(e) => setBeatNote(parseInt(e.target.value))}
					defaultValue={4}
				>
					{numberNoteTypes.map((num) => (
						<option key={num + 'ts'} value={num}>
							{num}
						</option>
					))}
				</select>
			</div>
			<ModifyMusicAssigner
				onClick={onClick.bind(null, beatsPerMeasure, beatNote)}
			>
				<p style={{ display: 'inline' }}>{beatsPerMeasure}</p>/
				<p style={{ display: 'inline' }}>{beatNote}</p>
			</ModifyMusicAssigner>
		</AssignerInputLayout>
	);
};

export default TimeSignatureAssigner;
