import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PackagePlus, RotateCcw } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Subscription, MembershipPlan } from "@/data/types";

interface CurrentPlanCardProps {
  sub: Subscription | undefined;
  plan: MembershipPlan | undefined;
  onRenew: () => void;
  onAddAddon: () => void;
}

function statusBadge(status: string) {
  const cls: Record<string, string> = {
    Active: "bg-success/10 text-success",
    Expired: "bg-destructive/10 text-destructive",
    Frozen: "bg-warning/10 text-warning",
    Paid: "bg-success/10 text-success",
    Pending: "bg-warning/10 text-warning",
    Failed: "bg-destructive/10 text-destructive",
  };
  return <Badge variant="outline" className={cls[status] || ""}>{status}</Badge>;
}

export function CurrentPlanCard({ sub, plan, onRenew, onAddAddon }: CurrentPlanCardProps) {
  return (
    <Card>
      <CardHeader><CardTitle>Current Plan</CardTitle></CardHeader>
      <CardContent>
        {sub ? (
          <div className="grid grid-cols-2 gap-4">
            {([
              ["Plan", plan!.name],
              ["Price", `₹${plan!.price}/mo`],
              ["Status", null],
              ["Start Date", formatDate(sub.startDate)],
              ["End Date", formatDate(sub.endDate)],
              ["Duration", `${plan!.durationMonths} month(s)`],
            ] as [string, string | null][]).map(([label, value]) => (
              <div key={label}>
                <p className="text-sm text-muted-foreground">{label}</p>
                {label === "Status" ? statusBadge(sub.status) : <p className="font-medium">{value}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div>No current subscription</div>
        )}

        <div className="col-span-2 mt-4 flex gap-3">
          <Button onClick={onRenew}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Renew Subscription
          </Button>
          <Button variant="outline" onClick={onAddAddon}>
            <PackagePlus className="mr-2 h-4 w-4" />
            Add Addon
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
