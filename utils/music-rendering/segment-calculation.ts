export type SectionIterator = (x: number, itemNumber: number) => void;

//spacingFactor is in terms of itemWidth. If spacingFactor is 1, there will be room 1 'itemWidth' space between each item.
//pad will add half of spacingFactor width to each side
export const calculateSectionWidth = (
  itemWidth: number,
  itemCount: number,
  spacingFactor: number,
  pad = true
) => {
  let width = itemWidth * itemCount;
  const spacingWidth = itemWidth * spacingFactor;
  width += spacingWidth * (itemCount - 1);
  if (pad) width += spacingWidth;
  return width;
};

export const iterateSection = (
  containerWidth: number,
  startX: number,
  itemCount: number,
  pad: boolean,
  cb: SectionIterator
) => {
  const gap = containerWidth / itemCount;
  let x = startX;
  if (pad) {
    x += gap / 2;
  }
  for (let i = 0; i < itemCount; i++) {
    cb(x, i);
    x += gap;
  }
};
