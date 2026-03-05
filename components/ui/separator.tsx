import * as React from "react";

export interface SeparatorProps {
  /** Texto en el centro del separador (ej. "o continúa con") */
  children?: React.ReactNode;
  className?: string;
}

function Separator({ children, className = "" }: SeparatorProps) {
  return (
    <div className={`relative my-4 ${className}`.trim()}>
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-secondary" />
      </div>
      {children && (
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-2 text-foreground-muted">
            {children}
          </span>
        </div>
      )}
    </div>
  );
}

export { Separator };
