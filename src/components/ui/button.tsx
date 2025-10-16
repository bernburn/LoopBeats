import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const getVariantClasses = (variant: string) => {
  switch (variant) {
    case 'outline':
      return 'border border-gray-700 bg-transparent hover:bg-gray-800 text-white';
    case 'destructive':
      return 'bg-red-600 hover:bg-red-700 text-white';
    case 'ghost':
      return 'bg-transparent hover:bg-gray-800 text-gray-300';
    default:
      return 'bg-blue-600 hover:bg-blue-700 text-white';
  }
};

const getSizeClasses = (size: string) => {
  switch (size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm';
    case 'lg':
      return 'px-6 py-3 text-lg';
    default:
      return 'px-4 py-2 text-base';
  }
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'md', disabled, ...props }, ref) => (
    <button 
      ref={ref} 
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${getVariantClasses(variant)} ${getSizeClasses(size)} ${className}`}
      disabled={disabled}
      {...props} 
    />
  )
);
Button.displayName = 'Button';
