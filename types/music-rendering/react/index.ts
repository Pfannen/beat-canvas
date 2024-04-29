import { MeasureRenderer } from "@/objects/music-rendering/measure-renderer";

export const drawMeasures = (
  ...args: ConstructorParameters<typeof MeasureRenderer>
) => {
  const renderer = new MeasureRenderer(...args);
  renderer.render();
};
