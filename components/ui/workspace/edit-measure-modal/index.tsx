import ReactModal from "react-modal";
import classes from "./index.module.css";
import { FunctionComponent } from "react";
import ModalMeasureDispay from "./modal-measure-display";
import useSelection, { Selection } from "@/components/hooks/useSelection";
import { useMusic } from "@/components/providers/music";
import { ABOVE_BELOW_CT } from "@/objects/measurement/constants";

type EditMeasureModalProps = {
  showModal: boolean;
  onClose: () => void;
  selectedMeasures: Selection;
};

const EditMeasureModal: FunctionComponent<EditMeasureModalProps> = ({
  showModal,
  onClose,
  selectedMeasures,
}) => {
  const s = useSelection();
  const { measures } = useMusic();
  return (
    <ReactModal
      isOpen={showModal}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
    >
      {showModal && (
        <div className={classes.measures}>
          <ModalMeasureDispay
            measures={[measures[selectedMeasures.start]]}
            onNoteClick={(identifier) => {
              console.log("Note click", identifier);
              s.updateSelection(identifier.noteIndex);
            }}
            getNoteOverlayClassName={(identifier) =>
              s.isValueSelected(identifier.noteIndex)
                ? classes.note_selected
                : ""
            }
            onComponentClick={(identifier) =>
              console.log("Component click", identifier)
            }
            aboveBelowCt={ABOVE_BELOW_CT}
          />
        </div>
      )}
    </ReactModal>
  );
};

export default EditMeasureModal;
