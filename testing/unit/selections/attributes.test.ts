import { SelectionData } from '../../../types/modify-score/assigner';
import { checkMetadata, createSelection } from '../helpers';
import { getAttributeSelectionMetadata } from '../../../utils/music/modify-score/assigner';
import assert, { equal } from 'assert';
import { getMeasureAttributeKeys } from '../../../utils/music';
import { MeasureAttributes } from '@/types/music';

test('Metadata is returned with every attribute mapping to a value', () => {
	const selections: SelectionData[] = [createSelection()];

	const metadata = getAttributeSelectionMetadata(selections);

	assert(metadata);
	equal(Object.keys(metadata).length, getMeasureAttributeKeys().length);
});

test('All selections have the same 1 attribute', () => {
	const nonRollingAttributes: Partial<MeasureAttributes> = { dynamic: 'p' };

	const selections: SelectionData[] = [
		createSelection({ nonRollingAttributes }),
		createSelection({ nonRollingAttributes }),
		createSelection({ nonRollingAttributes }),
	];

	const metadata = getAttributeSelectionMetadata(selections);

	assert(metadata);
	equal(checkMetadata(metadata, { dynamic: true }), true);
});

test('All selections have the same 2 attributes', () => {
	const nonRollingAttributes: Partial<MeasureAttributes> = {
		dynamic: 'p',
		clef: 'alto',
	};

	const selections: SelectionData[] = [
		createSelection({ nonRollingAttributes }),
		createSelection({ nonRollingAttributes }),
		createSelection({ nonRollingAttributes }),
	];

	const metadata = getAttributeSelectionMetadata(selections);

	assert(metadata);
	equal(checkMetadata(metadata, { dynamic: true, clef: true }), true);
});

test('All selections have different attributes', () => {
	const selections: SelectionData[] = [
		createSelection({ nonRollingAttributes: { dynamic: 'p' } }),
		createSelection({ nonRollingAttributes: { clef: 'baritone' } }),
		createSelection({ nonRollingAttributes: { keySignature: 5 } }),
	];

	const metadata = getAttributeSelectionMetadata(selections);

	assert(metadata);
	equal(
		checkMetadata(metadata, {
			dynamic: false,
			clef: false,
			keySignature: false,
			wedge: true,
			timeSignature: true,
			repeat: true,
		}),
		true
	);
});
