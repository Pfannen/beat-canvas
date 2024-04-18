import { useRef, useState } from 'react';

export const useSelections = <K, V>() => {
	const [selections, setSelections] = useState<V[]>([]);
	const keyToSelectionValue = useRef<{ [key in string]: V }>({});

	// Stringifies the given key so it can serve as a key in a js object
	// Allows selection keys to be js objects
	const stringifyKey = (key: K) => JSON.stringify(key);

	// Returns the selection mapped to the key, or null
	const getSelection = (key: K) => {
		const strKey = stringifyKey(key);
		if (strKey in keyToSelectionValue.current) {
			return keyToSelectionValue.current[strKey];
		} else return null;
	};

	// Gets all the selections
	const getSelections = () => [...selections];

	// Returns whether or not the key has a selection
	const hasSelection = (key: K) => !!getSelection(key);

	// Removes the selection at the given key
	const removeSelection = (key: K) => {
		const remove = getSelection(key);
		if (!remove) return false;

		delete keyToSelectionValue.current[stringifyKey(key)];
		const newSelections = selections.filter(
			(selection) => selection !== remove
		);

		if (newSelections.length !== selections.length) {
			setSelections(newSelections);
		}

		return true;
	};

	// Adds the selection and associates it with the given key
	const addSelection = (key: K, selection: V) => {
		const selectionExists = !!getSelection(key);
		if (selectionExists) return false;

		keyToSelectionValue.current[stringifyKey(key)] = selection;
		const newSelections = [...selections, selection];
		setSelections(newSelections);

		return true;
	};

	// Updates the selections
	// If no value is supplied, it's assumed the key and its selection should be removed
	// Else if the key has a selection, it gets removed, else it gets added
	const update = (key: K, value?: V) => {
		if (!value) {
			removeSelection(key);
		} else {
			if (hasSelection(key)) removeSelection(key);
			else addSelection(key, value);
		}
	};

	// Clears the selections and the selection key map
	const clearSelections = () => {
		keyToSelectionValue.current = {};
		setSelections([]);
	};

	return {
		update,
		hasSelection,
		getSelection,
		clearSelections,
		selections: getSelections(),
	};
};
