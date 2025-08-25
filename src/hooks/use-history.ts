
"use client";

import { useState, useCallback } from 'react';
import { Edge, Node } from 'reactflow';

type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};

type UseHistoryOptions = {
    skip?: boolean;
}

export const useHistory = <T extends { nodes: Node[], edges: Edge[] }>(initialState: T) => {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const set = useCallback((
    newState: T | ((prevState: T) => T), 
    options: UseHistoryOptions = {}
  ) => {
    setState(currentState => {
      const newPresent = typeof newState === 'function' 
        ? (newState as (prevState: T) => T)(currentState.present) 
        : newState;

      if (options.skip) {
        return {
          ...currentState,
          present: newPresent,
        };
      }
      
      // If the new state is the same as the present, do nothing.
      if (JSON.stringify(newPresent) === JSON.stringify(currentState.present)) {
        return currentState;
      }

      const newPast = [...currentState.past, currentState.present];
      
      return {
        past: newPast,
        present: newPresent,
        future: [], // Clear future on new action
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState(currentState => {
      if (currentState.past.length === 0) return currentState;

      const newFuture = [currentState.present, ...currentState.future];
      const newPresent = currentState.past[currentState.past.length - 1];
      const newPast = currentState.past.slice(0, currentState.past.length - 1);

      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(currentState => {
      if (currentState.future.length === 0) return currentState;

      const newPast = [...currentState.past, currentState.present];
      const newPresent = currentState.future[0];
      const newFuture = currentState.future.slice(1);

      return {
        past: newPast,
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  return { state: state.present, setState: set, canUndo, canRedo, undo, redo };
};
