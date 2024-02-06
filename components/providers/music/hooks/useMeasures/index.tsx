import { useState } from "react";
import { Measure } from "../../types";

const useMeasures = () => {
  const [measures, setMeasures] = useState<Measure[]>([]);

  return { measures };
};

export default useMeasures;
