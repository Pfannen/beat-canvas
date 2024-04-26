import { FunctionComponent } from 'react';
import classes from './RepeatAssigner.module.css';
import AssignerDropdown from '../assigner-dropdown';
import { MeasureAttributes } from '@/types/music';
import { IKnownGenericAssignerComponent } from '@/types/modify-score/assigner';

interface RepeatAssignerProps
	extends IKnownGenericAssignerComponent<MeasureAttributes, 'repeat'> {}

const RepeatAssigner: FunctionComponent<RepeatAssignerProps> = ({
	assigner,
	metadataEntry,
}) => {
	return (
		<AssignerDropdown<MeasureAttributes, 'repeat'>
			tKey="repeat"
			label="Repeat"
			metadataEntry={metadataEntry}
			assigner={assigner}
		>
			{[
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
			]}
		</AssignerDropdown>
	);
};

export default RepeatAssigner;
