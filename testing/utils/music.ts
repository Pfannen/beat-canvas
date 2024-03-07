import Measurement from "@/objects/measurement";

export const getGenericMeasurementObj = () => {
  const componentsBelowBody = 5;
  const segmentFraction = 0.25;
  const height = 1;

  const measurement = new Measurement(
    componentsBelowBody,
    segmentFraction,
    height
  );
  return measurement;
};
