export class MeasureUtils2 {
  private static getFirstComponentCount(absoluteYPos: number) {
    return Math.floor(absoluteYPos / 2);
  }

  private static getSecondComponentCount(absoluteYPos: number) {
    return Math.ceil(absoluteYPos / 2) - 1;
  }

  private static bottomComponentIsLine(aBCount: number) {
    return aBCount % 2 === 0;
  }

  private static absolutePosIsOnLine(
    absoluteYPos: number,
    bottomIsLine: boolean
  ) {
    return bottomIsLine ? absoluteYPos % 2 === 1 : absoluteYPos % 2 === 0;
  }

  static getComponentsBelow(absoluteYPos: number, startsWithLine: boolean) {
    let componentOneCount = this.getFirstComponentCount(absoluteYPos);
    let componentTwoCount = this.getSecondComponentCount(absoluteYPos);

    if (startsWithLine) {
      return { lineCount: componentOneCount, spaceCount: componentTwoCount };
    }
    return { lineCount: componentTwoCount, spaceCount: componentOneCount };
  }

  static yPosToAbsolute(yPos: number, aBCount: number) {
    return yPos + aBCount + 1;
  }

  static getYPosInfo(yPos: number, aBCount: number) {
    const bottomIsLine = this.bottomComponentIsLine(aBCount);
    const absolutePos = this.yPosToAbsolute(yPos, aBCount);
    const componentCounts = this.getComponentsBelow(absolutePos, bottomIsLine);
    const isOnLine = this.absolutePosIsOnLine(absolutePos, bottomIsLine);
    return { componentCounts, isOnLine };
  }

  static getComponentsInMeasure(aBCount: number, bodyCt: number) {
    const bottomIsLIne = this.bottomComponentIsLine(aBCount);
    return this.getComponentsBelow(aBCount * 2 + bodyCt + 1, bottomIsLIne);
  }
}
