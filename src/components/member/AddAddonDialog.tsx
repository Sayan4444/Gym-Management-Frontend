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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Addon</DialogTitle>
          <DialogDescription>Choose an add-on to purchase</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {gymAddons.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border p-4">
              <p className="font-medium">{a.name}</p>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">₹{a.price.toFixed(2)}</span>
                <RazorpayButton
                  item={a}
                  type="Add-On"
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
