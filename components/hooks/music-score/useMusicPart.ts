import useMeasures from '@/components/providers/music/hooks/useMeasures';
import { MusicPart } from '@/types/music';
import { useEffect, useState } from 'react';

const useMusicPart = (musicPart: MusicPart) => {
	const [part, setPart] = useState(musicPart);

	const measuresHook = useMeasures(musicPart.measures);

	const updatePartName = (name: string) => {
		part.attributes.name = name;
		setPart({ ...part });
	};

	const updatePartInstrument = (instrument: string) => {
		part.attributes.instrument = instrument;
		setPart({ ...part });
	};

	const replacePart = (musicPart: MusicPart) => {
		measuresHook.replaceMeasures(musicPart.measures);
		setPart(musicPart);
	};

	// If 'measures' is a copy of the true measures state, this will rerender infinitely if we update part state
	useEffect(() => {
		if (part.measures !== measuresHook.measures) {
			part.measures = measuresHook.measures;
			setPart({ ...part });
		}
	}, [measuresHook.measures, part]);

	return {
		partItems: {
			part,
			updatePartName,
			updatePartInstrument,
			replacePart,
		},
		measuresItems: measuresHook,
	};
};

export default useMusicPart;
