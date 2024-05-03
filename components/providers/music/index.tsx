'use client';

import { ReactNode, createContext, useContext } from 'react';
import { FunctionComponent } from 'react';
import useMeasures from './hooks/useMeasures';
import { Measure } from './types';
import useMusicScore from '@/components/hooks/music-score/useMusicScore';

type MusicCtx = ReturnType<typeof useMusicScore>;

//const MusicContext = createContext<MusicCtx>(useMeasures.initialState);
const MusicContext = createContext<MusicCtx>(useMusicScore.initialState);

type MusicProviderProps = {
	children: ReactNode;
};

const mockMeasures: Measure[] = [
	{
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

const MusicProvider: FunctionComponent<MusicProviderProps> = ({ children }) => {
	//const measureData = useMeasures(mockMeasures);
	const scoreData = useMusicScore();
	return (
		<MusicContext.Provider value={scoreData}>{children}</MusicContext.Provider>
	);
};

export default MusicProvider;

export const useMusic = () => {
	return useContext(MusicContext);
};
