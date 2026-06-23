import type React from "react";
import { cn } from "@/lib/utils";

interface PageShellProps {
  header?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function PageShell({
  header,
  left,
  right,
  footer,
  children,
}: PageShellProps) {
  return (
    <div className="min-h-screen w-full bg-background selection:bg-primary/15 selection:text-foreground">
      <div className="flex flex-col w-full h-screen">
        {header && (
          <header className="shrink-0 border-b border-border bg-background z-20">
            {header}
          </header>
        )}
        
        <div className="flex-1 flex overflow-hidden">
          {left && (
            <aside className="w-80 shrink-0 border-r border-border bg-card hidden lg:block overflow-y-auto premium-scrollbar">
              {left}
            </aside>
          )}
          
          <section className="flex-1 overflow-y-auto overflow-x-hidden relative bg-muted/30 premium-scrollbar">
            <div className="container max-w-7xl mx-auto p-4 md:p-8 lg:p-10">
              {children}
            </div>
            {footer && <div className="p-8 border-t border-border mt-auto">{footer}</div>}
          </section>

          {right && (
            <aside className="w-80 shrink-0 border-l border-border bg-card hidden xl:block overflow-y-auto premium-scrollbar">
              {right}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}


export default PageShell;
