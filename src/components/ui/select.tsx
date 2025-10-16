import * as React from 'react';

export const Select = ({ value, onValueChange, children }: any) => <div>{children}</div>;
export const SelectTrigger = ({ children, className = '' }: any) => <button className={className}>{children}</button>;
export const SelectValue = ({ children }: any) => <span>{children}</span>;
export const SelectContent = ({ children }: any) => <div>{children}</div>;
export const SelectItem = ({ value, children, onClick }: any) => (
  <div onClick={() => onClick?.(value)}>{children}</div>
);
