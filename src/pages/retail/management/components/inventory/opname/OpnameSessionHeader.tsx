import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OpnameSessionHeaderProps {
  storeName?: string;
  onDiscard: () => void;
  onSubmit: () => void;
}

export const OpnameSessionHeader: React.FC<OpnameSessionHeaderProps> = ({
  storeName,
  onDiscard,
  onSubmit,
}) => {
  return (
    <Card className="rounded-2xl bg-primary text-foreground border-none shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
          <div>
            <div className="text-label opacity-70 italic">
              ACTIVE OPNAME SESSION
            </div>
            <div className="text-xl font-bold tracking-tighter">
              {storeName || "MAIN_TERMINAL"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={onDiscard}
            className="text-foreground/70 hover:text-foreground font-bold text-xs uppercase"
          >
            Discard
          </Button>
          <Button
            onClick={onSubmit}
            className="bg-white text-primary hover:bg-primary/5 font-semibold text-xs gap-2 rounded-xl px-5 h-10"
          >
            <CheckCircle2 className="w-4 h-4" /> Submit Count
          </Button>
        </div>
      </div>
    </Card>
  );
};
