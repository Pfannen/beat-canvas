import { MusicPart, MusicScore } from '@/types/music';
import { getDefaultPart, getDefaultScore } from '@/utils/music/music-score';
import { useEffect, useState } from 'react';
import useMusicPart from './useMusicPart';
import useMeasures from '@/components/providers/music/hooks/useMeasures';

const useMusicScore = (init?: MusicScore) => {
	const [musicScore, setMusicScore] = useState<MusicScore>(
		init || getDefaultScore
	);
	const [selectedPartId, setSelectedPartId] = useState(
		musicScore.parts[0].attributes.id
	);

	const { partItems, measuresItems } = useMusicPart(musicScore.parts[0]);

	const setTitle = (title: string) => {
		if (title !== musicScore.title) {
			musicScore.title = title;
			setMusicScore({ ...musicScore });
		}
	};

	const addPart = () => {
		musicScore.parts.push(getDefaultPart());
		setMusicScore({ ...musicScore });
	};

	const removePart = (partId: string) => {
		let newParts = musicScore.parts.filter(
			(part) => part.attributes.id !== partId
		);

		if (newParts.length !== musicScore.parts.length) {
			if (!newParts.length) newParts = [getDefaultPart()];
			musicScore.parts = newParts;
			setMusicScore({ ...musicScore });
		}
	};

	const selectPart = (partId: string) => {
		if (partId === selectedPartId) return;

		const selectedPart = musicScore.parts.find(
			(part) => part.attributes.id === partId
		);
		if (selectedPart) {
			setSelectedPartId(partId);
			partItems.replacePart(selectedPart);
		}
	};

	const replaceMusicScore = (musicScore: MusicScore) => {
		if (!musicScore.parts.length) musicScore.parts.push(getDefaultPart());
		partItems.replacePart(musicScore.parts[0]);
		setSelectedPartId(musicScore.parts[0].attributes.id);
		setMusicScore(musicScore);
	};

	useEffect(() => {
		setMusicScore((score) => {
			const idx = score.parts.findIndex(
				(part) => part.attributes.id === selectedPartId
			);
			if (idx !== -1) score.parts[idx] = partItems.part;
			return { ...score };
		});
	}, [partItems.part, selectedPartId]);

	return {
		scoreItems: {
			musicScore,
			selectedPartId,
			setTitle,
			addPart,
			removePart,
			selectPart,
			replaceMusicScore,
		},
		partItems: {
			updatePartName: partItems.updatePartName,
			updatePartInstrument: partItems.updatePartInstrument,
		},
		measuresItems,
	};
};

useMusicScore.initialState = {
	scoreItems: {
		musicScore: getDefaultScore(),
		selectedPartId: 'P1',
		setTitle: (title: string) => {},
		addPart: () => {},
		removePart: (partId: string) => {},
		selectPart: (partId: string) => {},
		replaceMusicScore: (musicScore: MusicScore) => {},
	},
	partItems: {
		updatePartName: (name: string) => {},
		updatePartInstrument: (instrument: string) => {},
	},
	measuresItems: useMeasures.initialState,
};

export default useMusicScore;
