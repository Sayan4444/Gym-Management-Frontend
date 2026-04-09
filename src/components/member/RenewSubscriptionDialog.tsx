import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RazorpayButton } from "@/components/RazorpayButton";
import type { MembershipPlan } from "@/data/types";

interface RenewSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gymPlans: MembershipPlan[];
  prefill: { name?: string; email?: string; contact?: string };
  onSuccess: () => void;
  onError: () => void;
}

export function RenewSubscriptionDialog({
  open,
  onOpenChange,
  gymPlans,
  prefill,
  onSuccess,
  onError,
}: RenewSubscriptionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Renew Subscription</DialogTitle>
          <DialogDescription>Choose a plan to subscribe to</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {gymPlans.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-muted-foreground">
                  {p.durationMonths} month{p.durationMonths > 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">₹{p.price.toFixed(2)}</span>
                <RazorpayButton
                  item={p}
                  type="Membership Plan"
                  prefill={prefill}
                  onSuccess={onSuccess}
                  onError={onError}
                />
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
