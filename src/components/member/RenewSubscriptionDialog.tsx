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
      <DialogContent className="border-[#00BFFF]/20 bg-[#090909] text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-black uppercase tracking-tight">Renew Subscription</DialogTitle>
          <DialogDescription className="text-gray-500">Choose a plan to subscribe to</DialogDescription>
        </DialogHeader>
        <div className="custom-scrollbar max-h-[60vh] space-y-3 overflow-y-auto pr-1">
          {gymPlans.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div>
                <p className="font-bold text-white">{p.name}</p>
                <p className="text-xs text-gray-500">
                  {p.durationMonths} month{p.durationMonths > 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-black text-[#39FF14]">₹{p.price.toFixed(2)}</span>
                <RazorpayButton
                  item={p}
                  type="Membership Plan"
                  prefill={prefill}
                  onSuccess={onSuccess}
                  onError={onError}
                  onPaymentStart={() => onOpenChange(false)}
                />
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
