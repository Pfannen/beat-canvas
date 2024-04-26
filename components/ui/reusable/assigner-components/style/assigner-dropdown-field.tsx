import { FunctionComponent, ReactNode, SelectHTMLAttributes } from 'react';
import classes from './AssignerDropdownField.module.css';

// Default type of T is a string
export type DropdownItem<T = string> = {
	displayValue?: string;
	value: T;
};

interface AssignerDropdownFieldProps<T>
	extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
	children: DropdownItem<T>[];
}

const AssignerDropdownField = <T extends any = string>({
	children,
	...props
}: AssignerDropdownFieldProps<T>): JSX.Element => {
	return (
		<select {...props}>
			{children.map(({ value, displayValue }) => {
				const valueString = JSON.stringify(value);
				return (
					<option key={valueString} value={valueString}>
						{displayValue?.toString() || valueString}
					</option>
				);
			})}
		</select>
	);
};

export default AssignerDropdownField;
