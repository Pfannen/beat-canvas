import {
	ChangeEventHandler,
	FunctionComponent,
	ReactNode,
	useState,
} from 'react';
import classes from './assigner-dropdown.module.css';
import ModifyMusicAssigner from './style/modify-music-assigner-button';
import AssignerInputLayout from './style/assigner-input-layout';
import AssignerDropdownField, {
	DropdownItem,
} from './style/assigner-dropdown-field';
import { IMusicAssignerComponent } from '@/types/modify-score/assigner';

export type DropdownItemDisplay = DropdownItem & {
	el: ReactNode;
};

interface AssignerDropdownProps extends IMusicAssignerComponent {
	onClick: (value: string) => void;
	label: string;
	children: DropdownItemDisplay[];
}

const AssignerDropdown: FunctionComponent<AssignerDropdownProps> = ({
	onClick,
	label,
	children,
	disabled,
	add,
}) => {
	const [selectedItem, setSelectedItem] = useState<DropdownItemDisplay>(
		children[0]
	);

	const onOptionSelected: ChangeEventHandler<HTMLSelectElement> = (event) => {
		const newSelectedItem = children[event.target.selectedIndex];
		if (newSelectedItem !== selectedItem) setSelectedItem(newSelectedItem);
	};

	return (
		<AssignerInputLayout disabled={disabled}>
			<label htmlFor={label}>{label}: </label>
			<AssignerDropdownField
				id={label}
				onChange={onOptionSelected}
				disabled={disabled}
			>
				{children}
			</AssignerDropdownField>
			<ModifyMusicAssigner
				onClick={onClick.bind(null, selectedItem.value)}
				disabled={disabled}
				add={add}
			>
				{selectedItem.el}
			</ModifyMusicAssigner>
		</AssignerInputLayout>
	);
};

export default AssignerDropdown;
