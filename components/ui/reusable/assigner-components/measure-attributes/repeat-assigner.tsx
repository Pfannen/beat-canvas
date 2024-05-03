import { FunctionComponent, useRef, useState } from 'react';
import classes from './RepeatAssigner.module.css';
import AssignerDropdown, {
	AssignerDropdownItemDisplay,
} from '../assigner-dropdown';
import { MeasureAttributes, Repeat } from '@/types/music';
import { IKnownGenericAssignerComponent } from '@/types/modify-score/assigner';
import AssignerInputLayout from '../style/assigner-input-layout';
import AssignerDropdownField from '../style/assigner-dropdown-field';
import AttributeAssignerButton from './buttons/attribute-assigner-button';
import AssignerInputField from '../style/assigner-input-field';
import { repeatsAreEqual } from '@/utils/music/is-equal-helpers';
import { clamp } from '@/utils';

const repeatDisplay: AssignerDropdownItemDisplay<Repeat>[] = [
	{
		el: <p>Forward</p>,
		value: { forward: true },
		displayValue: 'Forward',
	},
	{
		el: <p>Backward</p>,
		value: { forward: false, repeatCount: 1 },
		displayValue: 'Backward',
	},
];

const MIN_RC = 1;
const MAX_RC = 10;
const DEFAULT_RC = 1;

interface RepeatAssignerProps
	extends IKnownGenericAssignerComponent<MeasureAttributes, 'repeat'> {}

const RepeatAssigner: FunctionComponent<RepeatAssignerProps> = ({
	assigner,
	metadataEntry,
}) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isForwardRepeat, setIsForwardRepeat] = useState<boolean>(true);
	const [repeatCount, setRepeatCount] = useState<number>(DEFAULT_RC);

	return (
		<AssignerInputLayout>
			<label htmlFor="repeat-type">Repeat:</label>
			<AssignerDropdownField
				id="repeat-type"
				onChange={(e) => {
					const isForward = repeatDisplay[e.target.selectedIndex].value.forward;
					setIsForwardRepeat(isForward);
				}}
			>
				{repeatDisplay}
			</AssignerDropdownField>
			<AssignerInputField
				id="repeat-count"
				disabled={isForwardRepeat}
				ref1={inputRef}
				type="number"
				defaultValue={DEFAULT_RC}
				onChange={(e) => {
					let num = clamp(MIN_RC, MAX_RC, parseInt(e.target.value));
					if (!num) return;
					inputRef.current!.value = num.toString();
				}}
				onBlur={(e) => {
					let num = clamp(MIN_RC, MAX_RC, parseInt(e.target.value));
					if (!num) num = DEFAULT_RC;
					inputRef.current!.value = num.toString();
					setRepeatCount(num);
				}}
			/>
			<AttributeAssignerButton
				tKey="repeat"
				assigner={assigner}
				metadataEntry={metadataEntry}
				currentValue={
					isForwardRepeat ? { forward: true } : { forward: false, repeatCount }
				}
				equalityDelegate={repeatsAreEqual}
			>
				{isForwardRepeat ? <p>Forward</p> : <p>Backward</p>}
			</AttributeAssignerButton>
		</AssignerInputLayout>
	);
};

export default RepeatAssigner;

/* <AssignerDropdown<MeasureAttributes, 'repeat'>
			tKey="repeat"
			label="Repeat"
			metadataEntry={metadataEntry}
			assigner={assigner}
		>
			{repeatDisplay}
		</AssignerDropdown> */
