import { useState } from "react";

type MeasureSelections = { start: number; end: number };

const useWorkSpace = () => {
  const [selectedMeasures, setSelectedMeasures] = useState<MeasureSelections>();
  const [mode, setMode] = useState();

  const onMeasureClick = (index: number) => {
    if (mode) {
      //invoke mode delegate and pass in update delegates (clear, updateStart, updateEnd, ...)
    } else {
      updateSelection(index);
    }
  };

  const updateSelection = (index: number) => {
    if (!selectedMeasures) {
      updateStart(index);
      return;
    }

    if (selectedMeasures.start === index || selectedMeasures.end === index) {
      clearSelections();
      return;
    }

    if (index < selectedMeasures.start) {
      updateStart(index);
    } else {
      updateEnd(index);
    }
  };

  const clearSelections = () => {
    setSelectedMeasures(undefined);
  };

  const updateStart = (start: number) => {
    setSelectedMeasures((prevState) => {
      if (prevState) {
        return { start, end: prevState.end };
      } else {
        return { start, end: start };
      }
    });
  };

  const updateEnd = (end: number) => {
    setSelectedMeasures((prevState) => {
      if (prevState) {
        return { start: prevState.start, end };
      } else {
        return { start: end, end };
      }
    });
  };

  const getSelectedMeasures = () => {
    return selectedMeasures;
  };

  const isMeasureSelected = (index: number) => {
    if (!selectedMeasures) {
      return false;
    }
    return !(selectedMeasures.start > index || selectedMeasures.end < index);
  };

  const isSelectedMeasures = () => {
    return !!selectedMeasures;
  };

  const getMeasureDelegates = () => {
    return { getSelectedMeasures, isMeasureSelected, isSelectedMeasures };
  };

  return {
    onMeasureClick,
    getSelectedMeasures,
    isMeasureSelected,
    isSelectedMeasures,
    getMeasureDelegates,
  };
};

export default useWorkSpace;
