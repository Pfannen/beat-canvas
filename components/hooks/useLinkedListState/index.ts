import { Cell } from "@/types";
import { useState } from "react";

const useLinkedListState = <S extends Cell<S> | undefined>(
  initialState: S | (() => S)
) => {
  const [state, setState] = useState(() => initializeState(initialState));

  const setLinkedListState = (updateFn: (prevState: S) => S | void) => {
    setState((prevState) => {
      const copyState = { ...prevState };
      const newHead = updateFn(copyState.next as S);
      const newNode = { next: newHead || copyState.next };
      copyState.next = undefined;
      console.log(newNode);
      return newNode;
    });
  };

  const reduceNodes = <T>(reducer: (cell: S) => T) => {
    const data: T[] = [];
    let currNode = state.next;
    while (currNode) {
      data.push(reducer(currNode));
      currNode = currNode.next;
    }
    return data;
  };

  return [state.next, setLinkedListState, reduceNodes] as [
    S,
    typeof setLinkedListState,
    typeof reduceNodes
  ];
};

export default useLinkedListState;

const initializeState = <S>(initialState: S | (() => S)) => {
  const list =
    typeof initialState === "function"
      ? (initialState as () => S)()
      : initialState;
  return { next: list } as Cell<S>;
};
