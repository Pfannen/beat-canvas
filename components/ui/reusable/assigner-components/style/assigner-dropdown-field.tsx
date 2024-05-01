import {
	FunctionComponent,
	LegacyRef,
	MutableRefObject,
	ReactNode,
	SelectHTMLAttributes,
} from 'react';
import classes from './assigner-dropdown-field.module.css';

// Default type of T is a string
export type DropdownItem<T = string> = {
	displayValue?: string;
	value: T;
};

interface AssignerDropdownFieldProps<T>
	extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
	children: DropdownItem<T>[];
	inputRef?: LegacyRef<HTMLSelectElement>;
}

const AssignerDropdownField = <T extends any = string>({
	children,
	inputRef,
	...props
}: AssignerDropdownFieldProps<T>): JSX.Element => {
	return (
		<select {...props} ref={inputRef} className={classes.assigner_select_input}>
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
