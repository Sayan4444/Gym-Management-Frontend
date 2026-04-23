import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PackagePlus, RotateCcw } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Subscription, MembershipPlan, UserAddon } from "@/data/types";

interface CurrentPlanCardProps {
  sub: Subscription | undefined;
  plan: MembershipPlan | undefined;
  upcomingSub?: Subscription;
  upcomingPlan?: MembershipPlan;
  userAddons?: UserAddon[];
  onAddSubscription: () => void;
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

export function CurrentPlanCard({ sub, plan, upcomingSub, upcomingPlan, userAddons = [], onAddSubscription, onAddAddon }: CurrentPlanCardProps) {
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

        {upcomingSub && upcomingPlan && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="text-sm font-semibold mb-3">Upcoming Plan</h4>
            <div className="grid grid-cols-2 gap-4">
              {([
                ["Plan", upcomingPlan.name],
                ["Price", `₹${upcomingPlan.price}/mo`],
                ["Status", null],
                ["Start Date", formatDate(upcomingSub.startDate)],
                ["End Date", formatDate(upcomingSub.endDate)],
                ["Duration", `${upcomingPlan.durationMonths} month(s)`],
              ] as [string, string | null][]).map(([label, value]) => (
                <div key={`upcoming-${label}`}>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  {label === "Status" ? statusBadge(upcomingSub.status) : <p className="font-medium">{value}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {userAddons.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="text-sm font-semibold mb-3">Active Add-ons</h4>
            <div className="flex flex-wrap gap-2">
              {userAddons.map((ua) => (
                <Badge key={ua.id} variant="secondary" className="px-3 py-1">
                  {ua.addon?.name || "Unknown Addon"} 
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="col-span-2 mt-4 flex gap-3">
          <Button onClick={onAddSubscription}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Buy New Subscription
          </Button>
          <Button variant="outline" onClick={onAddAddon}>
            <PackagePlus className="mr-2 h-4 w-4" />
            Buy New Addon
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
