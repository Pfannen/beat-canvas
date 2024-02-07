import { ReactNode, createContext, useContext } from "react";
import { FunctionComponent } from "react";
import useMeasures from "./hooks/useMeasures";

type MusicCtx = ReturnType<typeof useMeasures>;

const MusicContext = createContext<MusicCtx>(useMeasures.initialState);

type MusicProviderProps = {
  children: ReactNode;
};

const MusicProvider: FunctionComponent<MusicProviderProps> = ({ children }) => {
  const measureData = useMeasures();
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
