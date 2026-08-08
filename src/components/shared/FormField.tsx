import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FormFieldProps extends React.ComponentProps<typeof Input> {
  label: string;
}


export function FormField({ label, className, id, ...props }: FormFieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="text-xs text-muted-foreground">
        {label}
      </label>
      <Input id={inputId} className={cn(className)} {...props} />
    </div>
  );
}
