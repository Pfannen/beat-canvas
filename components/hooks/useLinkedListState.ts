import { Cell } from "@/types";
import { useState } from "react";

const useLinkedListState = <S extends Cell<S>>(initialState: S | (() => S)) => {
  const [state, setState] = useState(() => initializeState(initialState));

  const setLinkedListState = (updateFn: (prevState: S) => void) => {
    setState((prevState) => {
      updateFn(prevState.next as S);
      const newNode = { next: prevState.next };
      prevState.next = undefined;
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
