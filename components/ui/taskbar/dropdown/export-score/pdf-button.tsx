import MP3SVG from '@/components/ui/svg/mp3';
import { FunctionComponent } from 'react';
import { MusicScore } from '@/types/music';
import PDFIconSVG from '@/components/ui/svg/pdf-icon-svg';

type ExportPDFButtonProps = {
	score?: MusicScore;
};

const ExportPDFButton: FunctionComponent<ExportPDFButtonProps> = ({
	score,
}) => {
	const getPDF = async () => {
		if (score) {
			const res = await fetch('/pdf/create', {
				method: 'POST',
				body: JSON.stringify(score),
			});
			const data = await res.blob();
			const url = URL.createObjectURL(data);
			window.open(url, '_blank');
		}
	};
	return (
		<button onClick={getPDF}>
			PDF
			<PDFIconSVG />
		</button>
	);
};

export default ExportPDFButton;
