import * as React from 'react';

export function Tabs({ children, defaultValue, className = '' }: { children: React.ReactNode; defaultValue?: string; className?: string }) { return <div className={className}>{children}</div>; }
export function TabsList({ children, className = '' }: any) { return <div className={className}>{children}</div>; }
export function TabsTrigger({ children, className = '', value }: any) { return <button className={className}>{children}</button>; }
export function TabsContent({ children, className = '', value }: any) { return <div className={className}>{children}</div>; }
