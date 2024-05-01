import {
  MeasureModifier,
  duplicateMeasures,
} from "@/components/providers/music/hooks/useMeasures/utils";

import { Selection } from "@/components/hooks/useSelection";

export type MeasureMode = "duplicate" | "modify" | "loop";

export type ModeRegistry = { [mode in MeasureMode]?: ModeDelegate };

export type Delegates = {
  clearSelection: () => void;
  getSelection: () => Selection | undefined;
  getSelectionCount: () => number;
  setMode: (mode: MeasureMode) => void;
  clearMode: () => void;
};

export type ModeDelegate = (
  delegates: Delegates,
  selectedMeasure: number
) => ReturnType<MeasureModifier<any>> | undefined;

const duplicateModeDel: ModeDelegate = (dels, insertIndex) => {
  const selection = dels.getSelection();
  const count = dels.getSelectionCount();
  if (!selection) {
    return;
  }
  dels.clearMode();
  //   dels.clearSelection();
  return duplicateMeasures({
    startIndex: selection.start,
    count,
    insertIndex: insertIndex + 1,
  });
};

export const modeRegistry: ModeRegistry = {
  duplicate: duplicateModeDel,
};
