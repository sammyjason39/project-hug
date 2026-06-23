import type React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryActions?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  icon,
  primaryAction,
  secondaryActions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 p-6 md:p-8 rounded-2xl border border-border bg-card">
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          {icon ? (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary border border-border">
              {icon}
            </div>
          ) : null}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle ? (
              <p className="text-label mt-1.5">{subtitle}</p>
            ) : null}
          </div>
        </div>
      </div>
      {(primaryAction || secondaryActions) && (
        <div className="flex flex-wrap items-center gap-3">
          {secondaryActions}
          {primaryAction}
        </div>
      )}
    </div>
  );
}


export default PageHeader;
