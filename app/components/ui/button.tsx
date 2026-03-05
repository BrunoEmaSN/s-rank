import * as React from "react";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  default:
    "bg-accent text-accent-foreground hover:opacity-90",
  outline:
    "border border-secondary bg-secondary/30 text-foreground hover:bg-secondary/50",
  ghost: "text-foreground hover:bg-secondary/30",
  destructive:
    "bg-red-600 text-white hover:bg-red-700",
} as const;

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-4 py-3 text-base",
} as const;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  /** Para botones que solo muestran icono */
  icon?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "default",
      size = "md",
      icon = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`${buttonBase} ${variants[variant]} ${sizes[size]} ${icon ? "p-2" : ""} ${className}`.trim()}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonBase, variants as buttonVariants, sizes as buttonSizes };
