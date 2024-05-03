"use client";

import { FunctionComponent } from "react";
import classes from "./index.module.css";
import TaskbarButton from "@/components/ui/taskbar/buttons/taskbar-button";
import ImportScoreDropdown from "../taskbar/dropdown/import-score-dropdown";
import ImportAudioDropdown from "../taskbar/dropdown/import-audio-dropdown";
import ExportScoreDropdown, {
  ExportScoreDropdownProps,
} from "../taskbar/dropdown/export-score/export-score-dropdown";
import { MusicScore } from "@/types/music";
import { concatClassNames } from "@/utils/css";

interface ImportExportPageProps extends ExportScoreDropdownProps {
  setScore: (score: MusicScore) => void;
  setImportedAudio: (audio: File) => void;
}

const ImportExportPage: FunctionComponent<ImportExportPageProps> = ({
  setScore,
  setImportedAudio,
  ...exportProps
}) => {
  return (
    <div className={classes.container}>
      <div className={classes.imports}>
        <ExportScoreDropdown {...exportProps} />
        <ImportScoreDropdown setScore={setScore} />
        <ImportAudioDropdown setImportedAudio={setImportedAudio} />
      </div>
    </div>
  );
};

export default ImportExportPage;
