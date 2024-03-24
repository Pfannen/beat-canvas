import { BODY_CT } from "./constants";

export class MeasureBuilder {
  constructor(aboveBelowCount: number) {
    const componentCount = aboveBelowCount * 2 + BODY_CT;
  }
}
