import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RazorpayButton } from "@/components/RazorpayButton";
import type { Addon } from "@/data/types";

interface AddAddonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gymAddons: Addon[];
  prefill: { name?: string; email?: string; contact?: string };
  onSuccess: () => void;
  onError: () => void;
}

export function AddAddonDialog({
  open,
  onOpenChange,
  gymAddons,
  prefill,
  onSuccess,
  onError,
}: AddAddonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[#00BFFF]/20 bg-[#090909] text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-black uppercase tracking-tight">Add Addon</DialogTitle>
          <DialogDescription className="text-gray-500">Choose an add-on to purchase</DialogDescription>
        </DialogHeader>
        <div className="custom-scrollbar max-h-[60vh] space-y-3 overflow-y-auto pr-1">
          {gymAddons.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <p className="font-bold text-white">{a.name}</p>
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-black text-[#39FF14]">₹{a.price.toFixed(2)}</span>
                <RazorpayButton
                  item={a}
                  type="Add-On"
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
