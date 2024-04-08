import { FunctionComponent, ReactNode, SelectHTMLAttributes } from 'react';
import classes from './AssignerDropdownField.module.css';

export type DropdownItem = {
	displayValue?: string;
	value: string;
};

interface AssignerDropdownFieldProps
	extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
	children: DropdownItem[];
}

const AssignerDropdownField: FunctionComponent<AssignerDropdownFieldProps> = ({
	children,
	...props
}) => {
	return (
		<select {...props}>
			{children.map(({ value, displayValue }) => (
				<option key={value} value={value}>
					{displayValue || value}
				</option>
			))}
		</select>
	);
};

export default AssignerDropdownField;
