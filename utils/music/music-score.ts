import { Measure } from '@/components/providers/music/types';
import { MusicPart, MusicScore } from '@/types/music';

const mockMeasures: Measure[] = [
	{
		staticAttributes: {
			clef: 'treble',
			keySignature: 0,
			timeSignature: { beatNote: 4, beatsPerMeasure: 4 },
		},
		temporalAttributes: [
			{
				x: 0,
				attributes: {
					metronome: { beatNote: 4, beatsPerMinute: 120 },
					dynamic: 'mp',
				},
			},
		],
		notes: [
			{ x: 0, y: -2, type: 'sixteenth' },
			{ x: 0.25, y: -1, type: 'sixteenth' },
			{ x: 0.5, y: 0, type: 'sixteenth' },
			{ x: 0.75, y: 1, type: 'sixteenth' },
			// { x: 1, y: 1, type: "quarter" },
			// { x: 2, y: 2, type: "quarter" },
			// { x: 3, y: 10, type: "eighth" },
		],
	},
	// {
	//   notes: [
	//     { x: 0, y: 0, type: "quarter" },
	//     { x: 1, y: 1, type: "quarter" },
	//     { x: 2, y: 2, type: "quarter" },
	//     { x: 3, y: 10, type: "eighth" },
	//   ],
	// },
	// {
	//   notes: [
	//     { x: 0, y: 0, type: "quarter" },
	//     { x: 1, y: 1, type: "sixteenth" },
	//     { x: 1.25, y: 2, type: "sixteenth" },
	//     { x: 3, y: 10, type: "eighth" },
	//   ],
	// },
];

export const getDefaultPart = () => {
	const part: MusicPart = {
		attributes: {
			id: 'P1',
			instrument: 'Synth',
			name: 'Synth Part',
		},
		measures: mockMeasures,
	};

	return part;
};

export const getDefaultScore = () => {
	const score: MusicScore = {
		title: getDefaultScoreTitle(),
		parts: [getDefaultPart()],
	};

	return score;
};

export const getDefaultScoreTitle = () => 'A Beat Canvas Score';
