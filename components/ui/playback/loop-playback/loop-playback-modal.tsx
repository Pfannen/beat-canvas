import { FunctionComponent } from 'react';
import classes from './LoopPlaybackModal.module.css';
import modalStyles from '@/utils/shared-css/react-modal-styles.module.css';
import LoopPlaybackManager, {
	LoopPlaybackManagerProps,
} from './loop-playback-manager';
import ReactModal from 'react-modal';
import { reactModalStyles } from '@/utils/css';
import { Selection } from '@/components/hooks/useSelection';
import { MusicPlaybackManager } from '@/utils/audio/music-playback';

interface LoopPlaybackModalProps {
	showModal: boolean;
	onClose: () => void;
	sourcePlaybackManager: MusicPlaybackManager;
	selectedMeasures?: Selection;
}

const LoopPlaybackModal: FunctionComponent<LoopPlaybackModalProps> = ({
	sourcePlaybackManager,
	showModal,
	onClose,
	selectedMeasures,
}) => {
	if (!selectedMeasures) return <></>;
	const { start, end } = selectedMeasures;

	return (
		<ReactModal
			isOpen={showModal}
			onRequestClose={onClose}
			shouldCloseOnOverlayClick={true}
			style={reactModalStyles}
			overlayClassName={modalStyles.modal_overlay}
		>
			{showModal && (
				<LoopPlaybackManager
					start={start}
					end={end}
					sourcePlaybackManager={sourcePlaybackManager}
				/>
			)}
		</ReactModal>
	);
};

export default LoopPlaybackModal;
