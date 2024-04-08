import {
	ChangeEventHandler,
	FunctionComponent,
	ReactNode,
	useState,
} from 'react';
import classes from './assigner-dropdown.module.css';
import ModifyMusicAssigner from './style/modify-music-assigner-button';
import AssignerInputLayout from './style/assigner-input-layout';

type DropdownItem = {
	displayValue: string;
	value: string;
	el: ReactNode;
};

interface AssignerDropdownProps {
	onClick: (value: string) => void;
	label: string;
	children: DropdownItem[];
}

const AssignerDropdown: FunctionComponent<AssignerDropdownProps> = ({
	onClick,
	label,
	children,
}) => {
	const [selectedItem, setSelectedItem] = useState<DropdownItem>(children[0]);

	const onOptionSelected: ChangeEventHandler<HTMLSelectElement> = (event) => {
		const newSelectedItem = children[event.target.selectedIndex];
		if (newSelectedItem !== selectedItem) setSelectedItem(newSelectedItem);
	};

	return (
		<AssignerInputLayout>
			<label htmlFor={label}>{label}: </label>
			<select id={label} onChange={onOptionSelected}>
				{children.map(({ value, displayValue }) => (
					<option key={value} value={value}>
						{displayValue}
					</option>
				))}
			</select>
			<ModifyMusicAssigner onClick={onClick.bind(null, selectedItem.value)}>
				{selectedItem.el}
			</ModifyMusicAssigner>
		</AssignerInputLayout>
	);
};

export default AssignerDropdown;
