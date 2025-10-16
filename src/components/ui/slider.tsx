import * as React from 'react';

export interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function Slider({ value, onValueChange, min = 0, max = 100, step = 1, className = '' }: SliderProps) {
  const [val, setVal] = React.useState(value[0]);
  React.useEffect(() => { setVal(value[0]); }, [value]);
  return (
    <input
      type="range"
      className={className}
      min={min}
      max={max}
      step={step}
      value={val}
      onChange={(e) => {
        const v = Number(e.target.value);
        setVal(v);
        onValueChange([v]);
      }}
    />
  );
}
