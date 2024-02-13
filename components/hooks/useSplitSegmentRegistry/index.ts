import { useRef } from "react";

type SplitJoinDel = () => void;

type Registry = { [x: number]: { invoke: SplitJoinDel; lhs?: number }[] };

type Register = (x: number, delegate: SplitJoinDel, lhs?: number) => void;

export type RegistryDelegates = {
  register: Register;
  deregister: (x: number) => void;
};

const useSplitSegmentRegistry = () => {
  const registry = useRef<Registry>({});

  const register = (x: number, delegate: SplitJoinDel, lhs?: number) => {
    const delegateStack = registry.current[x] || [];
    delegateStack.push({ invoke: delegate, lhs });
    registry.current[x] = delegateStack;
  };

  //Since register is called in useEffect, there needs to be a cleanup function alongside it to stick to react best practices
  //In strict mode useEffect gets invoked twice, this is the cleanup function for useEffect which will cleanup the first invokation (and when a segment is joined)
  const deregister = (x: number) => {
    registry.current[x].pop();
  };

  //No delegates are removed here, when segments get joined, useEffect will call the cleanup method (deregister)
  const joinSegment = (x: number) => {
    const delegateStack = registry.current[x];
    if (delegateStack) {
      const registeredVal = peek(delegateStack);
      if (registeredVal?.lhs !== undefined) {
        joinSegment(registeredVal.lhs);
      } else if (registeredVal) {
        peek(delegateStack, 2)?.invoke();
      }
    }
  };

  //This is for an action like placing a note on a splitted segment, once the note is place you want to unplit all segments
  const joinAll = (x: number) => {
    const delegateStack = registry.current[x];
    if (delegateStack && delegateStack.length) {
      const registeredVal = peek(delegateStack);
      if (registeredVal?.lhs !== undefined) {
        joinAll(registeredVal.lhs);
      } else {
        delegateStack[0].invoke(); //Invoke the top-level segment's split (which will close all children)
      }
    }
  };

  const splitSegment = (x: number) => {
    const delegateStack = registry.current[x];
    if (delegateStack && delegateStack.length) {
      delegateStack[delegateStack.length - 1].invoke();
    } else {
      console.error(`No delegate registered for xPos: ${x}`);
    }
  };

  const getRegistryProps = (): RegistryDelegates => {
    return { register, deregister };
  };

  const getSegmentActions = <T extends object>(extraActions: T = {} as T) => {
    return { joinSegment, splitSegment, joinAll, ...extraActions };
  };

  return {
    register,
    deregister,
    joinSegment,
    splitSegment,
    getRegistryProps,
    getSegmentActions,
  };
};

export default useSplitSegmentRegistry;

const peek = <T>(array: T[], count = 1): T | undefined => {
  return array[array.length - count];
};
