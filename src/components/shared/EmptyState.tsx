import React from "react";
import { 
  Database, 
  AlertCircle, 
  Lock, 
  RefreshCw,
  SearchX,
  FileQuestion
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type EmptyStateVariant = "no-data" | "error" | "restricted" | "not-found" | "search";

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
  actionLabel?: string;
}

export function EmptyState({
  variant = "no-data",
  title,
  description,
  onRetry,
  className,
  actionLabel = "Refresh"
}: EmptyStateProps) {
  
  const config = {
    "no-data": {
      icon: Database,
      defaultTitle: "No data found",
      defaultDescription: "This view has no records yet. Data may appear once your workspace is configured or synced.",
      iconBg: "bg-muted",
      iconColor: "text-muted-foreground",
    },
    "error": {
      icon: AlertCircle,
      defaultTitle: "Something went wrong",
      defaultDescription: "We couldn't load this data. Check your connection and try again.",
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
    },
    "restricted": {
      icon: Lock,
      defaultTitle: "Access restricted",
      defaultDescription: "Your current role doesn't permit access to this module. Contact your administrator.",
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
    },
    "not-found": {
      icon: FileQuestion,
      defaultTitle: "Not found",
      defaultDescription: "The requested item could not be located in the current scope.",
      iconBg: "bg-accent",
      iconColor: "text-primary",
    },
    "search": {
      icon: SearchX,
      defaultTitle: "No results",
      defaultDescription: "No matches for your current search or filters.",
      iconBg: "bg-muted",
      iconColor: "text-muted-foreground",
    }
  }[variant];

  const Icon = config.icon;

  return (
    <div className={cn(
      "surface-card flex flex-col items-center justify-center p-10 md:p-12 text-center",
      className
    )}>
      <div className={cn(
        "h-14 w-14 rounded-xl flex items-center justify-center mb-5",
        config.iconBg
      )}>
        <Icon className={cn("h-7 w-7", config.iconColor)} />
      </div>
      
      <h3 className="text-lg font-semibold tracking-tight mb-2 text-foreground">
        {title || config.defaultTitle}
      </h3>
      
      <p className="text-muted-foreground max-w-md text-sm leading-relaxed mb-6">
        {description || config.defaultDescription}
      </p>

      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="rounded-full gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
