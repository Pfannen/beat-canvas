import useSelection, { Selection } from '@/components/hooks/useSelection';
import { useMusic } from '@/components/providers/music';
import {
	createMeasure,
	removeMeasures,
} from '@/components/providers/music/hooks/useMeasures/utils';
import { MeasureMode, modeRegistry } from './utils';
import { numIsUndefined } from '@/utils';
import useMode from '@/components/hooks/useMode';

const useWorkspace = () => {
	const selection = useSelection();
	const mode = useMode<MeasureMode>();
	const {
		measuresItems: { invokeMeasureModifier, measures },
	} = useMusic();

	const onMeasureClick = (index: number) => {
		//invoke mode delegate and pass in update delegates (clear, updateStart, updateEnd, ...)
		const currentMode = mode.get();
		if (currentMode) {
			const modeDel = modeRegistry[currentMode];
			if (modeDel) {
				const del = modeDel(
					selection.selectionDelegates({
						setMode: mode.set,
						clearMode: mode.clear,
					}),
					index
				);
				del && invokeMeasureModifier(del);
			}
		} else {
			selection.updateSelection(index);
		}
	};

	const addMeasureSelection = () => {
		const selectedMeasures = selection.getSelection();
		const insertIndex = numIsUndefined(selectedMeasures?.end)
			? undefined
			: selectedMeasures?.end! + 1;
		invokeMeasureModifier(createMeasure({ insertIndex }));
	};

	const removeMeasureSelection = () => {
		const selectedMeasures = selection.getSelection();
		if (!selectedMeasures) {
			return;
		}
		const count = selection.getSelectionCount();
		invokeMeasureModifier(
			removeMeasures({ startIndex: selectedMeasures.start, count })
		);
		// If all measures are being removed, add one back
		const measuresCount = measures.length;
		if (measuresCount === count) invokeMeasureModifier(createMeasure({}));
		selection.clearSelection();
	};

	return {
		onMeasureClick,
		getSelectedCount: selection.getSelectionCount,
		getSelectedMeasures: selection.getSelection,
		isSelectedMeasures: selection.isSelection,
		isMeasureSelected: selection.isValueSelected,
		setSingleSelection: selection.setSingleSelection,
		clearSelection: selection.clearSelection,
		measureDels: {
			addMeasureSelection,
			removeMeasureSelection,
		},
		mode,
	};
};

export default useWorkspace;

useWorkspace.intitialState = {
	onMeasureClick: (index: number) => {},
	getSelectedCount: () => 0,
	getSelectedMeasures: () => {
		return { start: 0, end: 0 } as Selection;
	},
	isSelectedMeasures: () => false,
	isMeasureSelected: (value: number) => false,
	setSingleSelection: (index: number) => {},
	clearSelection: () => {},
	measureDels: {
		addMeasureSelection: () => {},
		removeMeasureSelection: () => {},
	},
	mode: {
		get: () => undefined,
		set: (mode: MeasureMode) => {},
		clear: () => {},
	},
};
