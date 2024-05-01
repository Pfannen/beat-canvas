import { FunctionComponent, useEffect, useRef, useState } from 'react';
import classes from './MetronomeAssigner.module.css';
import AssignerInputLayout from '../style/assigner-input-layout';
import AssignerInputField from '../style/assigner-input-field';
import ModifyMusicAssigner from '../style/modify-music-assigner-button';
import AssignerDropdownField from '../style/assigner-dropdown-field';
import { AssignerDropdownItemDisplay } from '../assigner-dropdown';
import WholeNoteSVG from '@/components/ui/svg/notes/whole-note';
import HalfNoteSVG from '@/components/ui/svg/notes/half-note';
import QuarterNoteSVG from '@/components/ui/svg/notes/quarter-note';
import EighthNoteSVG from '@/components/ui/svg/notes/eigth-note';
import SixteenthNoteSVG from '@/components/ui/svg/notes/sixteenth-note';
import {
	IAttributeAssignerComponent,
	IKnownGenericAssignerComponent,
} from '@/types/modify-score/assigner';
import { getAssignValue } from '@/utils/music/modify-score/metadata-helpers';
import { MeasureAttributes, Metronome } from '@/types/music';
import { metronomesAreEqual } from '@/utils/music/is-equal-helpers';

const nameNoteTypesWithElement: AssignerDropdownItemDisplay[] = [
	{ value: '1', displayValue: 'whole', el: <WholeNoteSVG /> },
	{ value: '2', displayValue: 'half', el: <HalfNoteSVG /> },
	{ value: '4', displayValue: 'quarter', el: <QuarterNoteSVG /> },
	{ value: '8', displayValue: 'eighth', el: <EighthNoteSVG /> },
	{ value: '16', displayValue: 'sixteenth', el: <SixteenthNoteSVG /> },
];
const minBPM = 1;
const maxBPM = 360;
const defaultBPM = 60;

interface MetronomeAssignerProps
	extends IKnownGenericAssignerComponent<MeasureAttributes, 'metronome'> {}

const MetronomeAssigner: FunctionComponent<MetronomeAssignerProps> = ({
	assigner,
	metadataEntry,
}) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [bpm, setBPM] = useState(
		metadataEntry?.value?.beatsPerMinute || defaultBPM
	);
	const [beatNote, setBeatNote] = useState<AssignerDropdownItemDisplay>(
		nameNoteTypesWithElement[2]
	);

	// Need an equality checker for metronomes
	const assignValue = getAssignValue<MeasureAttributes, 'metronome'>(
		{ beatNote: 4, beatsPerMinute: bpm },
		metadataEntry,
		metronomesAreEqual
	);
	/* useEffect(() => {
		setBPM(metadataEntry?.value?.beatsPerMinute || bpm);
	}, [metadataEntry]); */

	return (
		<AssignerInputLayout>
			<label htmlFor="beats-per-minute">Metronome: </label>
			<div>
				<AssignerInputField
					type="number"
					id="beats-per-minute"
					defaultValue={bpm}
					onChange={(e) => {
						let num = parseInt(e.target.value);
						if (isNaN(num)) return;
						num = Math.min(maxBPM, num);
						num = Math.max(minBPM, num);
						inputRef.current!.value = num.toString();
					}}
					onBlur={() => {
						let num = parseInt(inputRef.current!.value);
						if (isNaN(num)) {
							num = defaultBPM;
							inputRef.current!.value = num.toString();
						}
						if (bpm !== num) setBPM(num);
					}}
					ref1={inputRef}
					min={minBPM}
					max={maxBPM}
					disabled={!metadataEntry}
				/>{' '}
				{/* <AssignerDropdownField
					onChange={(e) =>
						setBeatNote(nameNoteTypesWithElement[e.target.selectedIndex])
					}
					defaultValue={4}
					disabled={!metadataEntry}
				>
					{nameNoteTypesWithElement}
				</AssignerDropdownField> */}
			</div>
			<ModifyMusicAssigner
				onClick={() =>
					assigner('metronome', {
						beatNote: +beatNote.value!,
						beatsPerMinute: bpm,
					})
				}
				add={!!assignValue}
				disabled={!metadataEntry}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						gap: '8px',
					}}
				>
					<p>{bpm}</p>{' '}
					<div
					/* style={{
							maxWidth: '20px',
							maxHeight: '20px',
						}} */
					>
						{/* {beatNote.el} */}
						bpm
					</div>
				</div>
			</ModifyMusicAssigner>
		</AssignerInputLayout>
	);
};

export default MetronomeAssigner;
