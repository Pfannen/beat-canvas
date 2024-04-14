import { FunctionComponent } from 'react';
import classes from './DynamicAssigner.module.css';
import AssignerDropdown from '../assigner-dropdown';
import { IAttributeAssignerComponent } from '@/types/modify-score/assigner';
import { Dynamic } from '@/types/music/note-annotations';
import { getAssignValue } from '@/utils/music/modify-score/assigner';
import { MeasureAttributes } from '@/types/music';

const dynamics: Dynamic[] = ['p', 'pp', 'mp', 'mf', 'fp', 'f', 'ff'];

interface DynamicAssignerDropdownProps
	extends IAttributeAssignerComponent<'dynamic'> {}

const DynamicAssignerDropdown: FunctionComponent<
	DynamicAssignerDropdownProps
> = ({ assigner, attributeMetadata }) => {
	const assignValue = getAssignValue<MeasureAttributes, 'dynamic'>(
		attributeMetadata
	);

	return (
		<AssignerDropdown
			onClick={(dynamicValue) => assigner('dynamic', dynamicValue as Dynamic)}
			label="Dynamic"
			disabled={!attributeMetadata}
			add={!!assignValue}
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
