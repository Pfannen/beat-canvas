import { duplicateMeasures } from "@/components/providers/music/hooks/useMeasures/utils";
import { ModeDelegate } from "./useWorkspace";

export type MeasureMode = "duplicate";

export type ModeRegistry = { [mode in MeasureMode]: ModeDelegate };

const duplicateModeDel: ModeDelegate = (dels, insertIndex) => {
  const selection = dels.getSelection();
  const count = dels.getSelectionCount();
  if (!selection) {
    return;
  }
  dels.setMode();
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
