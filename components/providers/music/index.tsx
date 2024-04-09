"use client";

import { ReactNode, createContext, useContext } from "react";
import { FunctionComponent } from "react";
import useMeasures from "./hooks/useMeasures";
import { Measure } from "./types";

type MusicCtx = ReturnType<typeof useMeasures>;

const MusicContext = createContext<MusicCtx>(useMeasures.initialState);

type MusicProviderProps = {
  children: ReactNode;
};

const mockMeasures: Measure[] = [
  {
    notes: [
      { x: 0, y: 0, type: "quarter" },
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
  const measureData = useMeasures(mockMeasures);
  return (
    <MusicContext.Provider value={measureData}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicProvider;

export const useMusic = () => {
  return useContext(MusicContext);
};
