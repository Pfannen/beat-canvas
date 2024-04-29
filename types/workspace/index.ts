import { ComponentProps, ReactNode } from "react";
import { CSSPosition } from "..";

export type MeasureOverlay = CSSPosition & { measureIndex: number };

export type ControlButton = {
  label: ReactNode;
  buttonProps: ComponentProps<"button">;
};
