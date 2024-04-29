"use client";

import { CSSProperties, FunctionComponent } from "react";
import classes from "./index.module.css";
import useWorkSpace from "../../hooks/workspace/useWorkspace";
import ControlButtons from "./control-buttons";
import EditMeasureModal from "./edit-measure-modal";
import { useMusic } from "@/components/providers/music";
import { ControlButton } from "@/types/workspace";
import { MemoizedMeasureSelectedCanvas } from "../reusable/music-canvas/measure-select-canvas";
import useOverlayPositions from "@/components/hooks/workspace/useOverlayPositions";
import MeasureSelectOverlay from "./workspace-music-canvas/measure-select-overlay";

const aspectRatio = 0.75;

type WorkspaceProps = {};

const Workspace: FunctionComponent<WorkspaceProps> = () => {
  const { overlayPositions, onMeasureRendered } = useOverlayPositions(100);
  const ws = useWorkSpace();
  const { measuresItems } = useMusic();

  const buttons: ControlButton[] = [
    {
      label: "Add Measure",
      buttonProps: {
        onClick: ws.measureDels.addMeasureSelection,
      },
    },
    {
      label: "Duplicate Measures",
      buttonProps: {
        onClick: ws.mode.set.bind(null, "duplicate"),
        disabled: !ws.isSelectedMeasures(),
      },
    },
    {
      label: "Modify",
      buttonProps: {
        onClick: ws.mode.set.bind(null, "modify"),
        disabled: !ws.isSelectedMeasures(),
      },
    },
    {
      label: "Remove",
      buttonProps: {
        onClick: ws.measureDels.removeMeasureSelection,
        disabled: !ws.isSelectedMeasures(),
      },
    },
  ];

  const modalShouldOpen = ws.mode.get() === "modify" && ws.isSelectedMeasures();

  return (
    <>
      <ControlButtons buttons={buttons} />
      <div
        className={classes.music_canvas}
        style={{ "--aspect-ratio": aspectRatio } as CSSProperties}
      >
        <MemoizedMeasureSelectedCanvas
          measures={measuresItems.measures}
          aspectRatio={aspectRatio}
          onMeasureRendered={onMeasureRendered}
        />
        <MeasureSelectOverlay
          overlayPositions={overlayPositions}
          onMeasureSelect={ws.onMeasureClick}
          isMeasureSelected={ws.isMeasureSelected}
          areSelections={ws.isSelectedMeasures()}
        />
      </div>
      <EditMeasureModal
        showModal={modalShouldOpen}
        onClose={ws.mode.clear}
        selectedMeasures={ws.getSelectedMeasures()!}
      />
    </>
  );
};

export default Workspace;
