"use client";

import { FunctionComponent } from "react";
import useWorkSpace from "./hooks/useWorkspace";
import ControlButtons, { ControlButton } from "./control-buttons";
import WorkspaceMusicCanvas from "./workspace-music-canvas";
import EditMeasureModal from "./edit-measure-modal";
import { useMusic } from "@/components/providers/music";

type WorkspaceProps = {};

const Workspace: FunctionComponent<WorkspaceProps> = () => {
  const ws = useWorkSpace();
  const { measures } = useMusic();

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
      <WorkspaceMusicCanvas
        aspectRatio={0.75}
        measures={measures}
        onMeasureRendered={console.log}
        isMeasureSelected={ws.isMeasureSelected}
        onMeasureSelect={ws.onMeasureClick}
        areSelections={ws.isSelectedMeasures()}
      />
      <EditMeasureModal
        showModal={modalShouldOpen}
        onClose={ws.mode.clear}
        selectedMeasures={ws.getSelectedMeasures()!}
      />
    </>
  );
};

export default Workspace;
