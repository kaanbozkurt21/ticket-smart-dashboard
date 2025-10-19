import * as React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

export const Select = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none',
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
      </div>
    );
  }
);

Select.displayName = 'Select';

export const SelectOption = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <option
        className={cn('bg-background text-foreground', className)}
        ref={ref}
        {...props}
      />
    );
  }
);

SelectOption.displayName = 'SelectOption';
