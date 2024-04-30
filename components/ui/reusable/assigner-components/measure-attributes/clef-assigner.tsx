import { FunctionComponent } from 'react';
import classes from './ClefAssigner.module.css';
import { IKnownGenericAssignerComponent } from '@/types/modify-score/assigner';
import { Clef, MeasureAttributes } from '@/types/music';
import AssignerDropdown from '../assigner-dropdown';

const clef: Clef[] = ['treble', 'alto', 'bass'];

interface ClefAssignerProps
	extends IKnownGenericAssignerComponent<MeasureAttributes, 'clef'> {}

const ClefAssigner: FunctionComponent<ClefAssignerProps> = ({
	assigner,
	metadataEntry,
}) => {
	return (
		<>
			<AssignerDropdown<MeasureAttributes, 'clef'>
				metadataEntry={metadataEntry}
				tKey={'clef'}
				assigner={assigner}
				label="Clef"
			>
				{clef.map((clef) => {
					return {
						displayValue: clef,
						value: clef,
						el: <p>{clef}</p>,
					};
				})}
			</AssignerDropdown>
		</>
	);
};

export default ClefAssigner;
