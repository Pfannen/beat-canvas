import useSelection, { Selection } from "@/components/hooks/useSelection";
import { useMusic } from "@/components/providers/music";
import {
  MeasureModifier,
  createMeasure,
  duplicateMeasures,
  removeMeasures,
} from "@/components/providers/music/hooks/useMeasures/utils";
import { useState } from "react";
import { MeasureMode, modeRegistry } from "./utils";
import { numIsUndefined } from "@/utils";

type Delegates = {
  clearSelection: () => void;
  getSelection: () => Selection | undefined;
  getSelectionCount: () => number;
  setMode: (mode?: any) => void;
};

export type ModeDelegate = (
  delegates: Delegates,
  selectedMeasure: number
) => ReturnType<MeasureModifier<any>> | undefined;

const useWorkspace = () => {
  const selection = useSelection();
  const [mode, setMode] = useState<MeasureMode>();
  const { invokeMeasureModifier } = useMusic();

  //   const registerModeDelegate = (mode: string, del: ModeDelegate) => {
  //     registry.current[mode] = del;
  //   };

  //   const deregisterModeDelegate = (mode: string) => {
  //     registry.current[mode];
  //   };

  const onMeasureClick = (index: number) => {
    //invoke mode delegate and pass in update delegates (clear, updateStart, updateEnd, ...)
    if (mode) {
      const del = modeRegistry[mode](
        selection.selectionDelegates({ setMode }),
        index
      );
      del && invokeMeasureModifier(del);
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
    selection.clearSelection();
  };

  return {
    onMeasureClick,
    getSelectedMeasures: selection.getSelection,
    isSelectedMeasures: selection.isSelection,
    isMeasureSelected: selection.isValueSelected,
    measureDels: {
      addMeasureSelection,
      removeMeasureSelection,
    },
    setMode,
  };
};

export default useWorkspace;
