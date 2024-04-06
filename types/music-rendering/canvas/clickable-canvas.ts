import { UnitConverter } from "@/types";

export type ClickDelegate = (index: number) => void;

export type AbsolutePositionConverter = UnitConverter<number, number>;
