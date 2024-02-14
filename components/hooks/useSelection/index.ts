import { useState } from "react";

export type Selection = { start: number; end: number };

const useSelection = () => {
  const [selection, setSelection] = useState<Selection>();

  const updateSelection = (value: number) => {
    if (!selection) {
      updateStart(value);
      return;
    }

    if (selection.start === value || selection.end === value) {
      clearSelection();
      return;
    }

    if (value < selection.start) {
      updateStart(value);
    } else {
      updateEnd(value);
    }
  };

  const clearSelection = () => {
    setSelection(undefined);
  };

  const updateStart = (start: number) => {
    setSelection((prevState) => {
      if (prevState) {
        return { start, end: prevState.end };
      } else {
        return { start, end: start };
      }
    });
  };

  const updateEnd = (end: number) => {
    setSelection((prevState) => {
      if (prevState) {
        return { start: prevState.start, end };
      } else {
        return { start: end, end };
      }
    });
  };

  const getSelection = () => {
    return selection;
  };

  const isValueSelected = (value: number) => {
    if (!selection) {
      return false;
    }
    return !(selection.start > value || selection.end < value);
  };

  const isSelection = () => {
    return !!selection;
  };

  const getSelectionCount = () => {
    if (!selection) return 0;
    return selection.end - selection.start + 1;
  };

  const selectionDelegates = <T extends object>(
    extraDelegates: T = {} as T
  ) => {
    return {
      clearSelection,
      getSelection,
      getSelectionCount,
      ...extraDelegates,
    };
  };

  return {
    updateSelection,
    getSelection,
    isValueSelected,
    isSelection,
    clearSelection,
    getSelectionCount,
    selectionDelegates,
  };
};

export default useSelection;
