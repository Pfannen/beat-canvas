import { useState } from "react";

const useMode = <T extends string>() => {
  const [mode, setMode] = useState<T>();

  const get = () => mode;

  const set = (mode: T) => {
    setMode(mode);
  };

  const clear = () => {
    setMode(undefined);
  };

  return { get, set, clear };
};

export default useMode;
