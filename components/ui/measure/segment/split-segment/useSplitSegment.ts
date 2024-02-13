import { RegistryDelegates } from "@/components/hooks/useSplitSegmentRegistry";
import { useEffect, useState } from "react";

const useSplitSegment = (
  xPos: number,
  registryDels: RegistryDelegates,
  canChange: boolean,
  lhs?: number
) => {
  const [split, setSplit] = useState(false);

  const toggle = () => {
    console.log(canChange);
    if (canChange) setSplit((prevState) => !prevState);
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
  }, [canChange]);

  return { split };
};

export default useSplitSegment;
