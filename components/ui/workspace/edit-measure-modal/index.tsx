import classes from './index.module.css';
import modalStyles from '@/utils/shared-css/react-modal-styles.module.css';
import ReactModal from 'react-modal';
import { FunctionComponent, useRef } from 'react';
import { Selection } from '@/components/hooks/useSelection';
import ModalDisplay from './modal-display';
import { reactModalStyles } from '@/utils/css';

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
	const commitModalChanges = useRef<Function>();
	const onCloseModal = () => {
		if (commitModalChanges.current) {
			commitModalChanges.current();
		}
		onClose();
	};

	return (
		<ReactModal
			isOpen={showModal}
			onRequestClose={onCloseModal}
			shouldCloseOnOverlayClick={true}
			style={reactModalStyles}
			overlayClassName={modalStyles.modal_overlay}
		>
			{showModal && (
				<ModalDisplay
					selectedMeasures={selectedMeasures}
					liftCommitMeasures={(fn) => {
						commitModalChanges.current = fn;
					}}
				/>
			)}
		</ReactModal>
	);
};

export default EditMeasureModal;
