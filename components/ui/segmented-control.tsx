import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const segmentedControlVariants = cva(
  'inline-flex items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
  {
    variants: {
      direction: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
      },
    },
    defaultVariants: {
      direction: 'horizontal',
    },
  }
);

const segmentedControlItemVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-gray-50 dark:data-[state=active]:shadow-sm',
  {
    variants: {
      size: {
        default: 'h-9',
        sm: 'h-8 px-2',
        lg: 'h-10 px-4',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

interface SegmentedControlProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof segmentedControlVariants> {
  value: string;
  onValueChange: (value: string) => void;
}

const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  ({ className, direction, value, onValueChange, children, ...props }, ref) => (
    <div ref={ref} className={cn(segmentedControlVariants({ direction }), className)} {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === SegmentedControlItem) {
          return React.cloneElement(child, {
            isActive: child.props.value === value,
            onClick: () => onValueChange(child.props.value),
          });
        }
        return child;
      })}
    </div>
  )
);
SegmentedControl.displayName = 'SegmentedControl';

interface SegmentedControlItemProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof segmentedControlItemVariants> {
  value: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SegmentedControlItem = React.forwardRef<HTMLButtonElement, SegmentedControlItemProps>(
  ({ className, size, isActive, onClick, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        segmentedControlItemVariants({ size }),
        isActive &&
          'data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-gray-50 dark:data-[state=active]:shadow-sm',
        className
      )}
      data-state={isActive ? 'active' : 'inactive'}
      onClick={onClick}
      {...props}
    />
  )
);
SegmentedControlItem.displayName = 'SegmentedControlItem';

export { SegmentedControl, SegmentedControlItem };
