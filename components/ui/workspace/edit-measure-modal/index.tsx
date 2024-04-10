import ReactModal from "react-modal";
import classes from "./index.module.css";
import { FunctionComponent } from "react";
import ModalMeasureDispay from "./modal-measure-display";
import { Measure } from "@/components/providers/music/types";
import { Selection } from "@/components/hooks/useSelection";
import { useMusic } from "@/components/providers/music";

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
  const { measures } = useMusic();
  return (
    <ReactModal
      isOpen={showModal}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
    >
      {showModal && (
        <div className={classes.measures}>
          <ModalMeasureDispay measures={[measures[selectedMeasures.start]]} />
        </div>
      )}
    </ReactModal>
  );
};

export default EditMeasureModal;
