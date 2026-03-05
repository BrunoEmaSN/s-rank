import * as React from "react";

const checkboxBase =
  "h-4 w-4 rounded border-secondary bg-secondary/50 text-accent focus:ring-accent focus:ring-2 focus:ring-offset-2 focus:ring-offset-background cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Texto opcional junto al checkbox */
  label?: React.ReactNode;
  /** Clases del texto del label */
  labelClassName?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", label, labelClassName = "", ...props }, ref) => {
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          className={`${checkboxBase} ${className}`.trim()}
          {...props}
        />
        {label != null && (
          <span
            className={`text-sm text-foreground-muted ${labelClassName}`.trim()}
          >
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxBase };
