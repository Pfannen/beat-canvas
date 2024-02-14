import useSelection, { Selection } from "@/components/hooks/useSelection";
import { useMusic } from "@/components/providers/music";
import {
  MeasureModifier,
  createMeasure,
  duplicateMeasures,
} from "@/components/providers/music/hooks/useMeasures/utils";
import { useState } from "react";
import { MeasureMode, modeRegistry } from "./utils";

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
    if (mode) {
      const del = modeRegistry[mode](
        selection.selectionDelegates({ setMode }),
        index
      );
      if (del) {
        invokeMeasureModifier(del);
      }
      //invoke mode delegate and pass in update delegates (clear, updateStart, updateEnd, ...)
    } else {
      selection.updateSelection(index);
    }
  };

  const addMeasureHandler = () => {
    const selectedMeasures = selection.getSelection();
    const insertIndex =
      selectedMeasures?.end === undefined
        ? undefined
        : selectedMeasures?.end! + 1;
    invokeMeasureModifier(createMeasure({ insertIndex }));
  };

  const duplicateMeasureHandler = () => {
    const selectedMeasures = selection.getSelection();
    if (selectedMeasures) {
      invokeMeasureModifier(
        duplicateMeasures({
          startIndex: selectedMeasures.start,
          count: selectedMeasures.end - selectedMeasures.start + 1,
        })
      );
      selection.clearSelection();
    }
  };

  return {
    onMeasureClick,
    getSelectedMeasures: selection.getSelection,
    isSelectedMeasures: selection.isSelection,
    isMeasureSelected: selection.isValueSelected,
    measureDels: {
      addMeasureHandler,
      duplicateMeasureHandler,
    },
    setMode,
  };
};

export default useWorkspace;
