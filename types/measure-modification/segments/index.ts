export type SegementAction = "split" | "unsplit";

export type SegmentActionDelegates<TKey> = {
  split: (key: TKey) => void;
  unsplit: (key: TKey) => void;
  fold: (key: TKey) => void;
};

export type SegmentActionDel<TKey> = (
  action: SegementAction,
  key: TKey
) => void;

export type SegmentDelegates<TKey> = {
  getChildrenKeys: (
    parentKey: TKey,
    rightSiblingKey: TKey
  ) => { left: TKey; right: TKey };
};
