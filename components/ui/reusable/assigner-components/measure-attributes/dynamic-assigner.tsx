import { FunctionComponent } from 'react';
import AssignerDropdown from '../assigner-dropdown';
import { IKnownGenericAssignerComponent } from '@/types/modify-score/assigner';
import { Dynamic } from '@/types/music/note-annotations';
import { MeasureAttributes } from '@/types/music';

const dynamics: Dynamic[] = ['p', 'pp', 'mp', 'mf', 'fp', 'f', 'ff'];

interface DynamicAssignerDropdownProps
	extends IKnownGenericAssignerComponent<MeasureAttributes, 'dynamic'> {}

const DynamicAssignerDropdown: FunctionComponent<
	DynamicAssignerDropdownProps
> = ({ assigner, metadataEntry }) => {
	return (
		<AssignerDropdown<MeasureAttributes, 'dynamic'>
			metadataEntry={metadataEntry}
			tKey="dynamic"
			assigner={assigner}
			label="Dynamic"
		>
			{dynamics.map((dynamic) => {
				return {
					displayValue: dynamic,
					value: dynamic,
					el: <p>{dynamic}</p>,
				};
			})}
		</AssignerDropdown>
	);
};

export default DynamicAssignerDropdown;
