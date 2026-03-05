import * as React from "react";

const alertVariants = {
  error:
    "border-red-500/50 bg-red-500/10 text-red-400",
  success:
    "border-green-500/50 bg-green-500/10 text-green-400",
  warning:
    "border-amber-500/50 bg-amber-500/10 text-amber-400",
  info:
    "border-blue-500/50 bg-blue-500/10 text-blue-400",
} as const;

const base = "rounded-lg border px-4 py-2 text-sm";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof alertVariants;
  children: React.ReactNode;
}

function Alert({ className = "", variant = "error", children, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={`${base} ${alertVariants[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export { Alert, alertVariants };
