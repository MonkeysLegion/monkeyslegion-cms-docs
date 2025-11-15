import React, { useEffect, useRef } from "react";

/**
 * Custom hook to create an effect with an AbortController
 * Automatically aborts ongoing operations when the component unmounts or dependencies change
 * 
 * @param effect Function that receives the AbortSignal and performs side effects
 * @param deps Dependency array for the effect
 */
export function useAbortableEffect(
  effect: (signal: AbortSignal) => void | (() => void),
  deps: React.DependencyList = []
): void {
  useEffect(() => {
    // Create a new AbortController for this effect instance
    const abortController = new AbortController();
    const signal = abortController.signal;

    // Store the cleanup function returned from the effect
    const cleanup = effect(signal);

    // Return cleanup function that both aborts and calls any cleanup from the effect
    return (): void => {
      abortController.abort();
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, deps);
}

/**
 * Hook to provide an AbortSignal that's tied to component lifecycle
 * Returns a fresh signal each time the dependencies change
 */
export function useAbortSignal(deps: React.DependencyList = []): AbortSignal {
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Clean up previous controller if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new controller
    abortControllerRef.current = new AbortController();

    return (): void => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, deps);

  // Create new controller if needed and return its signal
  if (!abortControllerRef.current) {
    abortControllerRef.current = new AbortController();
  }

  return abortControllerRef.current.signal;
}
