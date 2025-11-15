'use client';

import { createContext, useContext } from 'react';

// Create a context to provide abort signals to stat components
interface AbortContextType {
  signal: AbortSignal | null;
  getSignalForTab: (tabId: string) => AbortSignal;
}

// Create and export the context
export const AbortContext = createContext<AbortContextType>({
  signal: null,
  getSignalForTab: () => new AbortController().signal
});

// Export the hook to use in stat components
export function useStatAbortSignal() : AbortSignal {
  const context = useContext(AbortContext);
  if (context == null || !context.signal) {
    console.warn("useStatAbortSignal: No signal found in context, creating new one");
    return new AbortController().signal;
  }
  return context.signal;
}
