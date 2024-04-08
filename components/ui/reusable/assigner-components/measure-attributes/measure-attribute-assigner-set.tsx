import { FunctionComponent } from 'react';
import classes from './measure-attribute-assigner-set.module.css';
import AssignerButtonSet from '../style/assigner-button-set';
import ModifyMusicAssigner from '../style/modify-music-assigner-button';
import DynamicAssigner from './buttons/dynamic';
import { MeasureAttributeAssigner } from '@/types/modify-score';
import { Dynamic } from '@/types/music/note-annotations';
import {
	ExecuteAssignerDelegate,
	PlacementData,
} from '@/types/modify-score/assigner';
import { useMusic } from '@/components/providers/music';
import { addNote } from '@/components/providers/music/hooks/useMeasures/utils';
import { modifyMeasureAttributesAdapter } from '@/utils/music/modify-score/music-hook-helpers';
import AssignerDropdown from '../assigner-dropdown';
import TimeSignatureAssigner from './time-signature-assigner';
import MetronomeAssigner from './metronome-assigner';

// Purely for testing purposes
const dynamics: Dynamic[] = ['p', 'pp', 'mp', 'mf', 'fp', 'f', 'ff'];
const keySignatures: string[] = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db'];

interface MeasureAttributeAssignerSetProps {
	liftExecuter?: ExecuteAssignerDelegate;
}

const MeasureAttributeAssignerSet: FunctionComponent<
	MeasureAttributeAssignerSetProps
> = ({ liftExecuter }) => {
	const { invokeMeasureModifier } = useMusic();

	const assigner: MeasureAttributeAssigner = (attribute, value) => {
		console.log({ attribute, value });

		if (!liftExecuter) return;

		const executeThis = (placementData: PlacementData) => {
			const { measureIndex, x } = placementData;

			invokeMeasureModifier(
				modifyMeasureAttributesAdapter(attribute, value, measureIndex, x)
			);
			return true;
		};
		liftExecuter(executeThis);
	};

	return (
		<div className={classes.measure_container}>
			<AssignerButtonSet title="Measure Attributes">
				{dynamics.map((dynamic) => (
					<DynamicAssigner
						key={dynamic}
						dynamic={dynamic}
						assigner={assigner}
					/>
				))}
			</AssignerButtonSet>
			<div className={classes.dropdowns}>
				<AssignerDropdown
					onClick={(dynamicValue) =>
						assigner('dynamic', dynamicValue as Dynamic)
					}
					label="Dynamic"
				>
					{dynamics.map((dynamic) => {
						return {
							displayValue: dynamic,
							value: dynamic,
							el: <p>{dynamic}</p>,
						};
					})}
				</AssignerDropdown>
				<AssignerDropdown
					onClick={(ksValue) => assigner('keySignature', parseInt(ksValue))}
					label="Key Signature"
				>
					{keySignatures.map((sig, i) => {
						return { displayValue: sig, value: i.toString(), el: <p>{sig}</p> };
					})}
				</AssignerDropdown>
				<TimeSignatureAssigner
					onClick={(bpm, bn) => {
						assigner('timeSignature', { beatsPerMeasure: bpm, beatNote: bn });
					}}
				/>
				<MetronomeAssigner
					onClick={(bpm, bn) =>
						assigner('metronome', { beatsPerMinute: bpm, beatNote: bn })
					}
				/>
			</div>
		</div>
	);
};

export default MeasureAttributeAssignerSet;
