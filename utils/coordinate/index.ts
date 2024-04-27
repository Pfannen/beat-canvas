import { Coordinate } from "@/types";

export const topToBottom = (y: number, height: number) => {
  return y - height;
};

export const bottomToTop = (y: number, height: number) => {
  return y + height;
};

export const leftToRight = (x: number, width: number) => {
  return x + width;
};

export const rightToLeft = (x: number, width: number) => {
  return x - width;
};

export const normalizeWidth = (x: number, w: number) => {
  if (w < 0) {
    w *= -1;
    x = rightToLeft(x, w);
  }
  return { x, w };
};

export const normalizeHeight = (y: number, h: number) => {
  if (h < 0) {
    h *= -1;
    y = topToBottom(y, h);
  }

  return { y, h };
};

export const centerToTopLeft = (
  x: number,
  y: number,
  width: number,
  height: number
) => {
  const widthFactor = width / 2;
  const heightFactor = height / 2;
  x = rightToLeft(x, widthFactor);
  y = bottomToTop(y, heightFactor);
  return { x, y };
};
