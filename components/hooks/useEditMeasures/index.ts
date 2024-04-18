import { useMusic } from "@/components/providers/music";
import { Measure } from "@/components/providers/music/types";
import { AssignerExecuter, SelectionData } from "@/types/modify-score/assigner";
import { MeasureAttributes } from "@/types/music";
import {
  getMeasureAttributes,
  getPartialMeasureAttributes,
} from "@/utils/music/measures/measure-attributes";
import { noteAttributeGenerator } from "@/utils/music/measures/measure-generator";
import { useEffect, useRef, useState } from "react";
import { useSelections } from "../useMultipleSelections";
import { ScorePositionID } from "@/types/modify-score";

export const useEditMeasures = (startIndex: number, endIndex: number) => {
  const { getMeasures, invokeMeasureModifier } = useMusic();

  const attributeCache = useRef<MeasureAttributes>();
  const [editMeasures, setEditMeasures] = useState<Measure[]>(
    getMeasures.bind(null, startIndex, endIndex - startIndex + 1, true)
  );

  // Utilize the selections hook for efficient selection look up and modification
  const { selections, update, clearSelections, hasSelection } = useSelections<
    ScorePositionID,
    SelectionData
  >();

  // On initial load and when the measures change, reset the attribute cache
  useEffect(() => {
    attributeCache.current = undefined;
  }, [editMeasures]);

  // Recomputes the edit measure's first measure's attributes if the cache is empty,
  // else it does nothing
  const recache = () => {
    if (!attributeCache.current) {
      // Attributes shouldn't be null, be need the if check
      const attributes = getMeasureAttributes(
        getMeasures(0, startIndex + 1),
        startIndex
      );
      attributeCache.current = attributes ? attributes : undefined;
    }
  };

  // Is this function needed?
  function* iterateEditMeasures() {
    recache();

    for (const yieldObj of noteAttributeGenerator(
      editMeasures,
      attributeCache.current
    )) {
      yield yieldObj;
    }
  }

  // Executes an assigner function with the measures being edited and the current selections
  // NOTE: Once an assigner function is executed, we need to re update all selections if we don't
  // want to clear them after we execute the assigner function
  const executeAssigner: AssignerExecuter = (assigner) => {
    const copy = editMeasures.slice();
    if (assigner(copy, selections)) {
      setEditMeasures(copy);
      // Should only clear selections when the assigner is successful?
      clearSelections();
    }
  };

  // Gets the attributes for the measure at the given index and x position
  const getAttributes = (
    measureIndex: number,
    x = 0
  ): MeasureAttributes | null => {
    if (measureIndex >= editMeasures.length || measureIndex < 0) return null;
    // Make sure we have measure attributes for the first edit measure
    recache();

    // Get the attributes of the desired measure and x position
    // Attributes shouldn't be null because the given measure index was checked
    const attributes = getMeasureAttributes(
      editMeasures,
      measureIndex,
      attributeCache.current,
      x
    );
    // Return null (if the attributes were null) or a copy of the attributes
    return attributes && { ...attributes };
  };

  // Updates the selections to either contain the given selection (if it doesn't already exist)
  // or remove the given selection (if it already exists)
  const updateSelection = (
    measureIndex: number,
    xStart: number,
    xEnd: number,
    y: number,
    noteIndex?: number
  ) => {
    // Generate the selection identifier from the parameters
    const positionID: ScorePositionID = {
      measureIndex,
      x: xStart,
    };

    // If the selection already exists, don't bother creating the selection data just to not use it
    if (hasSelection(positionID)) {
      update(positionID);
      return;
    }

    // Get the measure attributes of the given selection
    const attributes = getAttributes(measureIndex, xStart);
    // Shouldn't ever be null?
    if (attributes === null) return;
    const measure = editMeasures[measureIndex];

    // Create the new selection
    const newSelection: SelectionData = {
      measureIndex,
      // Deep copy measure notes
      measureNotes: JSON.parse(JSON.stringify(measure.notes)),
      xStart,
      xEnd,
      y,
      rollingAttributes: attributes,
      nonRollingAttributes: getPartialMeasureAttributes(measure, xStart),
      noteIndex,
    };

    // If the selection had a note, include it in the selection details
    const { notes } = measure;
    if (noteIndex !== undefined && noteIndex < notes.length) {
      newSelection.note = notes[noteIndex];
    }

    // Insert the selection along with its key
    // NOTE: This should always insert into the selection array because we already
    // checked if positionID existed
    update(positionID, newSelection);
  };

  const commitMeasures = () => {
    invokeMeasureModifier((getMeasures) => {
      const measures = getMeasures();
      const count = endIndex - startIndex + 1;
      for (let i = 0; i < count; i++)
        measures[i + startIndex] = editMeasures[i];
      return true;
    });
  };

  const isSegmentSelected = (measureIndex: number, x: number) => {
    return hasSelection({ measureIndex, x });
  };

  return {
    editMeasures,
    selections,
    iterateEditMeasures,
    executeAssigner,
    updateSelection,
    commitMeasures,
    isSegmentSelected,
  };
};
