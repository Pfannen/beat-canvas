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
    if (canChange) setSplit((prevState) => !prevState);
  };

  useEffect(() => {
    registryDels.register(xPos, toggle, lhs);
    return () => {
      registryDels.deregister(xPos);
    };
  }, []);

  return { split };
};

export default useSplitSegment;
