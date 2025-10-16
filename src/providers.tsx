'use client';

import type { ReactNode } from 'react';
// Temporarily simplified providers to avoid wagmi/viem version conflicts
// TODO: Re-enable blockchain features once dependencies are aligned

export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
