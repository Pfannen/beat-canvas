export const concatClassNames = (
  ...classNames: (string | undefined | false)[]
) => {
  return classNames
    .filter((val) => !!val)
    .join(" ")
    .trim();
};
