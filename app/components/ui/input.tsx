import * as React from "react";

const inputBase =
  "rounded-lg border border-secondary bg-secondary/50 px-4 py-2 text-foreground placeholder:text-foreground-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Clases adicionales al contenedor del input (cuando se usa con Label) */
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", containerClassName, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`${inputBase} ${className}`.trim()}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input, inputBase };
