import * as React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
export function Textarea({ className = '', ...props }: TextareaProps) { return <textarea className={`border rounded px-2 py-1 ${className}`} {...props} />; }
