import {
  MeasureComponent,
  MeasureComponentIterator,
  MeasureComponentValues,
} from "@/types/music-rendering";

export class MeasureComponents {
  private aboveBelowCount: number;
  private bodyCt: number;
  private bottomComponentIsLine: boolean;
  private measureComponentCounts: MeasureComponentValues;
  constructor(aboveBelowCount: number, bodyCt: number) {
    this.aboveBelowCount = aboveBelowCount;
    this.bodyCt = bodyCt;
    this.bottomComponentIsLine = this.aboveBelowCount % 2 === 0;
    this.measureComponentCounts = this.getComponentsBelow(
      this.aboveBelowCount * 2 + this.bodyCt + 1
    );
  }

  private static getFirstComponentCount(absoluteYPos: number) {
    return Math.floor(absoluteYPos / 2);
  }

  private static getSecondComponentCount(absoluteYPos: number) {
    return Math.ceil(absoluteYPos / 2) - 1;
  }

  private yPosToAbsolute(yPos: number) {
    return yPos + this.aboveBelowCount + 1;
  }

  private absolutePosIsOnLine(absoluteYPos: number) {
    return this.bottomComponentIsLine
      ? absoluteYPos % 2 === 1
      : absoluteYPos % 2 === 0;
  }

  private getComponentsBelow(absoluteYPos: number) {
    let componentOneCount =
      MeasureComponents.getFirstComponentCount(absoluteYPos);
    let componentTwoCount =
      MeasureComponents.getSecondComponentCount(absoluteYPos);

    if (this.bottomComponentIsLine) {
      return { line: componentOneCount, space: componentTwoCount };
    }
    return { line: componentTwoCount, space: componentOneCount };
  }

  public getYPosInfo(
    yPos: number
  ): MeasureComponentValues & { isOnLine: boolean } {
    const absolutePos = this.yPosToAbsolute(yPos);
    const componentCounts = this.getComponentsBelow(absolutePos);
    const isOnLine = this.absolutePosIsOnLine(absolutePos);
    return { ...componentCounts, isOnLine };
  }

  public isBodyComponent(yPos: number) {
    return -1 < yPos && yPos < this.bodyCt;
  }

  public getMeasureComponentCounts(): MeasureComponentValues {
    return this.measureComponentCounts;
  }

  public componentsBelowYPos(yPos: number) {
    return this.aboveBelowCount + yPos;
  }

  public yPosIsOnLine(yPos: number) {
    const absoluteYPos = this.yPosToAbsolute(yPos);
    return this.absolutePosIsOnLine(absoluteYPos);
  }

  public isBottomComponentLine() {
    return this.bottomComponentIsLine;
  }

  public iterateYPos(
    startYPos: number,
    endYPos: number,
    cb: (c: MeasureComponent) => void
  ) {
    let isLine = this.yPosIsOnLine(startYPos);
    for (let yPos = startYPos; yPos > endYPos - 1; yPos--) {
      cb({ isLine, isBody: this.isBodyComponent(yPos), yPos });
      isLine = !isLine;
    }
  }

  public iterateBodyComponents: MeasureComponentIterator = (cb) => {
    this.iterateYPos(this.bodyCt - 1, 0, cb);
  };

  public iterateMeasureComponents: MeasureComponentIterator = (cb) => {
    this.iterateYPos(
      this.bodyCt + this.aboveBelowCount - 1,
      -this.aboveBelowCount,
      cb
    );
  };

  // *[Symbol.iterator]():IterableIterator<MeasureComponent> {
  //   let isLine = this.bottomComponentIsLine;
  //   for(let yPos = 21; yPos > 0 - 1; yPos--){
  //     yield ({isLine, isBody: true, yPos})
  //     isLine = !isLine;
  //   }
  // }
}
