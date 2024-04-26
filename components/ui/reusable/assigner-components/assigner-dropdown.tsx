import { ChangeEventHandler, ReactNode, useState } from 'react';
import ModifyMusicAssigner from './style/modify-music-assigner-button';
import AssignerInputLayout from './style/assigner-input-layout';
import AssignerDropdownField, {
	DropdownItem,
} from './style/assigner-dropdown-field';
import { IGenericAssignerComponent } from '@/types/modify-score/assigner';
import {
	assignerShouldAddValue,
	assignerShouldDisable,
	getAssignValue,
} from '@/utils/music/modify-score/assigner';

export type AssignerDropdownItemDisplay<T = string> = DropdownItem<T> & {
	el: ReactNode;
};

interface AssignerDropdownProps<T, K extends keyof T>
	extends Omit<IGenericAssignerComponent<T, K>, 'children'> {
	label: string;
	children: AssignerDropdownItemDisplay<T[K]>[];
}

const AssignerDropdown = <T, K extends keyof T>({
	assigner,
	label,
	children,
	tKey,
	metadataEntry,
}: AssignerDropdownProps<T, K>) => {
	const [selectedItem, setSelectedItem] = useState<
		AssignerDropdownItemDisplay<T[K]>
	>(children[0]);

	const assignValue = getAssignValue<T, K>(selectedItem.value, metadataEntry);
	const disabled = assignerShouldDisable(metadataEntry);
	const add = assignerShouldAddValue(assignValue);

	const onOptionSelected: ChangeEventHandler<HTMLSelectElement> = (event) => {
		const newSelectedItem = children[event.target.selectedIndex];
		if (newSelectedItem !== selectedItem) setSelectedItem(newSelectedItem);
	};

	return (
		<AssignerInputLayout disabled={disabled}>
			<label htmlFor={label}>{label}: </label>
			<AssignerDropdownField<T[K]>
				id={label}
				onChange={onOptionSelected}
				disabled={disabled}
			>
				{children}
			</AssignerDropdownField>
			<ModifyMusicAssigner
				onClick={() => assigner(tKey, assignValue)}
				disabled={disabled}
				add={add}
			>
				{selectedItem.el}
			</ModifyMusicAssigner>
		</AssignerInputLayout>
	);
};

export default AssignerDropdown;
