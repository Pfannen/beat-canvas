import { deepyCopy } from '@/utils';
import { useRef, useState } from 'react';

export const useSelections = <K, V>() => {
	const [selections, setSelections] = useState<V[]>([]);
	const keyToSelectionValue = useRef<{ [key in string]: V }>({});

	// Stringifies the given key so it can serve as a key in a js object
	// Allows selection keys to be js objects or arrays
	const stringifyKey = (key: K) => JSON.stringify(key);

	// NOTE: Could override an existing key
	const addKey = (key: K, selectionValue: V) => {
		const strKey = stringifyKey(key);
		if (strKey in keyToSelectionValue.current) {
			const remove = keyToSelectionValue.current[strKey];
			filterSelections(remove);
		}
		keyToSelectionValue.current[strKey] = selectionValue;
	};

	const deleteKey = (key: K) =>
		delete keyToSelectionValue.current[stringifyKey(key)];

	const filterSelections = (removeSelection: V) => {
		const newSelections = selections.filter(
			(selection) => selection !== removeSelection
		);

		if (newSelections.length !== selections.length)
			setSelections(newSelections);
	};

	// Returns the selection mapped to the key, or null
	const getSelection = (key: K) => {
		const strKey = stringifyKey(key);
		if (strKey in keyToSelectionValue.current) {
			return keyToSelectionValue.current[strKey];
		} else return null;
	};

	// Gets all the selections
	// Can't have methods on objects if they're deep copied
	//const getSelections = () => deepyCopy(selections);
	const getSelections = () => selections;

	// Returns whether or not the key has a selection
	const hasSelection = (key: K) => !!getSelection(key);

	// Removes the selection at the given key
	const removeSelection = (key: K) => {
		const remove = getSelection(key);
		if (!remove) return false;

		deleteKey(key);
		filterSelections(remove);

		return true;
	};

	// Adds the selection and associates it with the given key
	const addSelection = (key: K, selection: V) => {
		const selectionExists = !!getSelection(key);
		if (selectionExists) return false;

		addKey(key, selection);
		const newSelections = [...selections, selection];
		setSelections(newSelections);

		return true;
	};

	// Updates the selections
	// If no value is supplied, it's assumed the key and its selection should be removed
	// Else if the key has a selection, it gets removed, else it gets added
	const updateSelection = (key: K, value?: V) => {
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

	const mapSelections = (
		mapper: (key: K, value: V) => { key: K; value: V } | null | undefined
	) => {
		const newSelections: V[] = [];
		const newMap: { [key in string]: V } = {};

		const keys = Object.keys(keyToSelectionValue.current);
		for (const key of keys) {
			const selection = keyToSelectionValue.current[key];
			const destructedKey = JSON.parse(key) as K;
			const update = mapper(destructedKey, selection);
			if (update) {
				newMap[stringifyKey(update.key)] = selection;
				newSelections.push(selection);
			}
		}

		keyToSelectionValue.current = newMap;
		setSelections(newSelections);
	};

	return {
		updateSelection,
		hasSelection,
		getSelection,
		clearSelections,
		mapSelections,
		selections: getSelections(),
	};
};
