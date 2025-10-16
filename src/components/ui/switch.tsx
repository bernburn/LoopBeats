import * as React from 'react';

export function Switch({ checked, onCheckedChange, className = '', id }: { checked: boolean; onCheckedChange: (v: boolean) => void; className?: string; id?: string; }) {
  return (
    <input
      id={id}
      type="checkbox"
      className={className}
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
    />
  );
}
