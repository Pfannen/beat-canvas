import { RegistryDelegates } from "@/components/hooks/useSplitSegement-old/useSplitSegmentRegistry";
import { useEffect, useState } from "react";

const useSplitSegment = (
  xPos: number,
  registryDels: RegistryDelegates,
  canChange: boolean,
  lhs?: number
) => {
  const [split, setSplit] = useState(false);

  const toggle = (split: boolean) => {
    if (canChange) setSplit(split);
  };

  useEffect(() => {
    if (canChange) {
      registryDels.register(xPos, toggle, lhs);
    }

    return () => {
      if (canChange) {
        registryDels.deregister(xPos);
      }
    };
  }, [canChange, registryDels]);

  return { split };
};

export default useSplitSegment;
