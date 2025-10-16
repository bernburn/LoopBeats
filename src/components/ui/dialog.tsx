import * as React from 'react';

export function Dialog({ children, open, onOpenChange, ...props }: { children: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) { return <>{children}</>; }
export function DialogTrigger({ children, asChild, ...props }: { children: React.ReactNode; asChild?: boolean }) { return <>{children}</>; }
export function DialogContent({ children, className = '', ...props }: any) { return <div className={className}>{children}</div>; }
export function DialogHeader({ children, ...props }: { children: React.ReactNode }) { return <div>{children}</div>; }
export function DialogTitle({ children, className = '', ...props }: { children: React.ReactNode; className?: string }) { return <h3 className={className}>{children}</h3>; }
export function DialogDescription({ children, className = '', ...props }: { children: React.ReactNode; className?: string }) { return <p className={className}>{children}</p>; }
