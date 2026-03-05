import * as React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Texto del label */
  children: React.ReactNode;
  /** Si es true, el label envuelve en columna (flex flex-col gap-1) */
  vertical?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = "", vertical = true, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`${vertical ? "flex flex-col gap-1" : "flex items-center gap-2"} ${className}`.trim()}
        {...props}
      >
        {children}
      </label>
    );
  }
);

Label.displayName = "Label";

const LabelText: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = "",
  children,
}) => (
  <span className={`text-sm font-medium text-foreground ${className}`.trim()}>
    {children}
  </span>
);

export { Label, LabelText };
