import { useState } from "react";

const useSplitState = (canSplit: boolean, defaultSplit = false) => {
  const [isSplit, setIsSplit] = useState(defaultSplit);

  const split = () => {
    if (canSplit) setIsSplit(true);
  };

  const join = () => {
    setIsSplit(false);
  };

  return [isSplit, split, join] as [boolean, typeof split, typeof join];
};

export default useSplitState;
