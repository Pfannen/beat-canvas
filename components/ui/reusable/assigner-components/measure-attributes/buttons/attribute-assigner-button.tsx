import { FunctionComponent } from 'react';
import classes from './AttributeAssignerButton.module.css';
import { IAttributeAssignerComponent } from '@/types/modify-score/assigner';
import { MeasureAttributes } from '@/types/music';
import { getAssignValue } from '@/utils/music/modify-score/metadata-helpers';
import ModifyMusicAssigner from '../../style/modify-music-assigner-button';
import { defaultAttributeValues } from '@/utils/music/modify-score/metadata-helpers/attributes';

const defaults = defaultAttributeValues;
interface AttributeAssignerButtonProps<K extends keyof MeasureAttributes>
	extends IAttributeAssignerComponent<K> {}

// NOTE: Can made this and note assigner component even more generic to get rid of both and only need 1 component
const AttributeAssignerButton = <K extends keyof MeasureAttributes>({
	assigner,
	tKey: key,
	metadataEntry,
	children,
	currentValue,
}: AttributeAssignerButtonProps<K>): JSX.Element => {
	const assignValue = getAssignValue<MeasureAttributes, K>(
		currentValue || defaults[key],
		metadataEntry
	);

	return (
		<ModifyMusicAssigner
			onClick={() => assigner(key, assignValue)}
			disabled={!metadataEntry}
			add={!!assignValue}
		>
			{children}
		</ModifyMusicAssigner>
	);
};

export default AttributeAssignerButton;
