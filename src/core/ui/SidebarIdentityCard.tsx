import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Building2, User, Fingerprint, Briefcase } from "lucide-react";

export const SidebarIdentityCard: React.FC = () => {
  const { user, session } = useAuth();

  if (!user || !session) return null;

  const currentCompany = user.user_companies?.find(uc => uc.tenant_id === session.tenant_id)?.company?.name || session.tenant_id;

  return (
    <div className="p-5 rounded-2xl bg-foreground text-background border border-border mb-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-background/10 rounded-lg flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-background" />
          </div>
          <p className="text-label text-background/60">Verified session</p>
        </div>

        <div className="space-y-1">
          <p className="text-base font-bold tracking-tight truncate">
            {user.first_name} {user.last_name}
          </p>
          <div className="flex items-center gap-2 text-label text-background/50">
            <Fingerprint className="h-3 w-3" />
            <span className="normal-case tracking-normal font-sans text-xs">{session.user_id.slice(0, 12)}…</span>
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-background/10">
          <div className="flex items-center gap-3">
            <Briefcase className="h-3.5 w-3.5 text-background/60" />
            <div>
              <p className="text-label text-background/50">Role</p>
              <p className="text-xs font-medium">{session.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <User className="h-3.5 w-3.5 text-background/60" />
            <div>
              <p className="text-label text-background/50">Assignment</p>
              <p className="text-xs font-medium">{session.department_id || "Unassigned"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Building2 className="h-3.5 w-3.5 text-background/60" />
            <div className="min-w-0">
              <p className="text-label text-background/50">Organization</p>
              <p className="text-xs font-medium truncate">{currentCompany}</p>
            </div>
          </div>
        </div>

        <Badge variant="secondary" className="w-full justify-center bg-background/10 text-background border-background/10 hover:bg-background/15">
          Security Level A-1
        </Badge>
      </div>
    </div>
  );
};
