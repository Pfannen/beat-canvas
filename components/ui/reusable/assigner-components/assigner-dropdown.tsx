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

export type DropdownItemDisplay = DropdownItem & {
	el: ReactNode;
};

interface AssignerDropdownProps {
	onClick: (value: string) => void;
	label: string;
	children: DropdownItemDisplay[];
}

const AssignerDropdown: FunctionComponent<AssignerDropdownProps> = ({
	onClick,
	label,
	children,
}) => {
	const [selectedItem, setSelectedItem] = useState<DropdownItemDisplay>(
		children[0]
	);

	const onOptionSelected: ChangeEventHandler<HTMLSelectElement> = (event) => {
		const newSelectedItem = children[event.target.selectedIndex];
		if (newSelectedItem !== selectedItem) setSelectedItem(newSelectedItem);
	};

	return (
		<AssignerInputLayout>
			<label htmlFor={label}>{label}: </label>
			<AssignerDropdownField id={label} onChange={onOptionSelected}>
				{children}
			</AssignerDropdownField>
			<ModifyMusicAssigner onClick={onClick.bind(null, selectedItem.value)}>
				{selectedItem.el}
			</ModifyMusicAssigner>
		</AssignerInputLayout>
	);
};

export default AssignerDropdown;
