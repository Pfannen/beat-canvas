import { useState } from "react";
import { Measure } from "../../types";
import { MeasureModifier } from "./utils";

const useMeasures = (initialMeasures?: Measure[]) => {
  const [measures, setMeasures] = useState<Measure[]>(initialMeasures || []);

  const invokeMeasureModifier = (del: ReturnType<MeasureModifier<any>>) => {
    setMeasures((prevState) => {
      const copyState = [...prevState];
      del(copyState);
      return copyState;
    });
  };
  return { measures, invokeMeasureModifier };
};

useMeasures.initialState = {
  measures: [],
  invokeMeasureModifier: () => {},
};

export default useMeasures;
