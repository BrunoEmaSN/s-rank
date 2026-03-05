import * as React from "react";

const selectBase =
  "rounded-lg border border-secondary bg-secondary/50 px-4 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-no-repeat bg-[length:1rem_1rem] bg-[right_0.5rem_center]";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`${selectBase} ${className}`.trim()}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";

export { Select, selectBase };
