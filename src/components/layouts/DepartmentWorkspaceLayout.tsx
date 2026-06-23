import * as React from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PageShell } from "@/core/ui/PageShell";
import { useSession } from "@/core/security/session";
import { cn } from "@/lib/utils";
import { 
  ChevronRight, 
  Menu,
  X,
  Monitor, 
  Target, 
  Settings,
  LucideIcon
} from "lucide-react";
import { SidebarIdentityCard } from "@/core/ui/SidebarIdentityCard";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

export type MenuItem = { label: string; to: string; icon: LucideIcon };
export type MenuSection = { title: string; items: MenuItem[] };

interface DepartmentWorkspaceLayoutProps {
  title: string;
  subtitle: string;
  headerIcon: LucideIcon;
  accentColor: string;
  engineName: string;
  pulseLabel: string;
  pulseIcon: LucideIcon;
  sections: MenuSection[];
  routeLabels: Record<string, string>;
  basePath: string;
  headerActions?: React.ReactNode;
  children?: React.ReactNode;
}

export default function DepartmentWorkspaceLayout({
  title,
  subtitle,
  headerIcon: HeaderIcon,
  accentColor,
  engineName,
  pulseLabel,
  pulseIcon: PulseIcon,
  sections,
  routeLabels,
  basePath,
  headerActions,
  children,
}: DepartmentWorkspaceLayoutProps) {
  const session = useSession();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  React.useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    console.log(`[DepartmentWorkspaceLayout:${engineName}] Mounted`, {
      path: location.pathname,
      tenant_id: session.tenant_id,
      location_id: session.location_id,
      role: session.role,
      permissions: session.permissions?.length,
    });
  }, [engineName, location.pathname, session]);

  const segments = location.pathname.replace(basePath, "").split("/").filter(Boolean);
  const breadcrumbs = (Array.isArray(segments) ? segments : []).map((segment, index) => ({
    label: routeLabels[segment] ?? segment.replace(/-/g, " "),
    path: `${basePath}/${segments.slice(0, index + 1).join("/")}`,
  }));

  const colorMap: Record<string, string> = {
    emerald: "text-success bg-success border-success",
    rose: "text-destructive bg-destructive border-destructive",
    amber: "text-warning bg-warning border-warning",
    orange: "text-warning bg-warning border-warning",
    blue: "text-primary bg-primary border-primary",
    purple: "text-primary bg-primary border-primary",
    indigo: "text-primary bg-primary border-primary",
    slate: "text-muted-foreground bg-muted-foreground border-border",
  };

  const c = colorMap[accentColor] || colorMap.blue;
  const [textC, bgC] = c.split(" ");

  const navLinkClass = (isActive: boolean) =>
    cn(
      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
      isActive
        ? "bg-foreground text-background"
        : "text-muted-foreground hover:bg-muted hover:text-foreground",
    );

  return (
    <div className="min-h-screen bg-muted/40 font-sans overflow-hidden flex flex-col">
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 lg:hidden transition-transform duration-300 ease-in-out",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col bg-card border-r border-border relative overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="text-label">{title}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-8">
              <SidebarIdentityCard />
              {(Array.isArray(sections) ? sections : []).map((section) => (
                <div key={section.title} className="space-y-2">
                  <p className="text-label pl-1">{section.title}</p>
                  <div className="space-y-1">
                    {(Array.isArray(section.items) ? section.items : []).map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.to || (item.to === basePath && location.pathname === `${basePath}/`);
                      return (
                        <NavLink key={item.to} to={item.to} className={navLinkClass(isActive)}>
                          <Icon className="h-4 w-4" />
                          <span className="flex-1 truncate">{item.label}</span>
                          <ChevronRight className={cn("h-3 w-3 opacity-0 group-hover:opacity-100", isActive ? "opacity-100" : "")} />
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <PageShell
        header={
          <div className="space-y-4 px-4 md:px-10 py-6 md:py-8 border-b border-border bg-background">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 shrink-0"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/core" className="text-label hover:text-primary transition-colors flex items-center gap-2">
                        <Monitor className="h-3 w-3" /> Core
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to={basePath} className="text-label hover:text-primary transition-colors">{engineName}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {(Array.isArray(breadcrumbs) ? breadcrumbs : []).map((item, index) => (
                    <React.Fragment key={item.path}>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {index === breadcrumbs.length - 1 ? (
                          <BreadcrumbPage className="text-label text-primary">{item.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={item.path} className="text-label hover:text-primary transition-colors">
                              {item.label}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl flex items-center justify-center border border-border bg-accent">
                  <HeaderIcon className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">{title}</h2>
                  <p className="text-label mt-2 flex items-center gap-2">
                    <Target className={cn("h-3 w-3", textC)} /> {subtitle}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 md:gap-3">
                {headerActions}
                <div className="hidden sm:flex items-center gap-2 bg-muted px-3 py-2 rounded-full border border-border">
                  <span className={cn("h-1.5 w-1.5 rounded-full", bgC)} />
                  <span className="text-label">Active</span>
                </div>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </div>
        }
        left={
          <div className="h-full flex flex-col bg-card border-r border-border relative overflow-hidden w-64 md:w-72">
            <ScrollArea className="flex-1">
              <div className="p-4 md:p-6 space-y-8">
                <SidebarIdentityCard />

                {(Array.isArray(sections) ? sections : []).map((section) => (
                  <div key={section.title} className="space-y-2">
                    <p className="text-label pl-1">{section.title}</p>
                    <div className="space-y-1">
                      {(Array.isArray(section.items) ? section.items : []).map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.to || (item.to === basePath && location.pathname === `${basePath}/`);
                        return (
                          <NavLink key={item.to} to={item.to} className={navLinkClass(isActive)}>
                            <Icon className="h-4 w-4" />
                            <span className="flex-1 truncate">{item.label}</span>
                            <ChevronRight className={cn("h-3 w-3 opacity-0 group-hover:opacity-100", isActive ? "opacity-100" : "")} />
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-border bg-muted/30">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-background border border-border">
                <div className="flex items-center gap-3">
                  <div className={cn("h-2 w-2 rounded-full", bgC)} />
                  <div className="space-y-0.5">
                    <p className="text-label leading-none">{pulseLabel}</p>
                    <p className={cn("text-xs font-medium", textC)}>Operational</p>
                  </div>
                </div>
                <PulseIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        }
      >
        <div className="p-0 h-full overflow-y-auto bg-muted/30">
          <ErrorBoundary>
            {children || <Outlet />}
          </ErrorBoundary>
        </div>
      </PageShell>
    </div>
  );
}
