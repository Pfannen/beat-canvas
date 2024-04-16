import ReactModal from "react-modal";
import { FunctionComponent } from "react";
import useSelection, { Selection } from "@/components/hooks/useSelection";
import { useMusic } from "@/components/providers/music";
import ModalDisplay from "./modal-display";

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
  const getMeasures = (startIndex: number, count: number) => {
    return [measures[startIndex]];
  };
  return (
    <ReactModal
      isOpen={showModal}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
    >
      {showModal && (
        <ModalDisplay
          getMeasures={getMeasures}
          selectedMeasures={selectedMeasures}
        />
      )}
    </ReactModal>
  );
};

export default EditMeasureModal;
