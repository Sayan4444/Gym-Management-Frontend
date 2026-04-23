import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAddons, useMe, useMembershipPlansByGym } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { CurrentPlanCard } from "@/components/member/CurrentPlanCard";
import { PaymentHistoryCard } from "@/components/member/PaymentHistoryCard";
import { RenewSubscriptionDialog } from "@/components/member/RenewSubscriptionDialog";
import { AddAddonDialog } from "@/components/member/AddAddonDialog";

export default function MemberSubscription() {
  const { data: me, isLoading: isAuthLoading } = useMe({ include: "gym,subscription,workout_plan,payments" });

  const subs = me?.subscription;
  // Loop over it and find the one which has status = "Active"
  const activeSub = subs?.find((s) => s.status === "Active");
  const plan = activeSub?.plan;
  const memberPayments = [...(me?.payments || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const gymPlans = useMembershipPlansByGym(me?.gymId)?.data?.memberships || [];
  const gymAddons = useAddons(me?.gymId)?.data?.addons || [];

  const { toast } = useToast();

  const [showAddSubscriptionDialog, setShowAddSubscriptionDialog] = useState(false);
  const [showAddonDialog, setShowAddonDialog] = useState(false);
  const [paymentPage, setPaymentPage] = useState(1);

  const prefill = { name: me?.name, email: me?.email, contact: me?.phone };

  if (isAuthLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Subscription</h1>
        <p className="text-muted-foreground">Manage your membership</p>
      </div>

      <CurrentPlanCard
        sub={activeSub}
        plan={plan}
        onAddSubscription={() => setShowAddSubscriptionDialog(true)}
        onAddAddon={() => setShowAddonDialog(true)}
      />

      <PaymentHistoryCard
        payments={memberPayments}
        page={paymentPage}
        setPage={setPaymentPage}
      />

      <RenewSubscriptionDialog
        open={showAddSubscriptionDialog}
        onOpenChange={setShowAddSubscriptionDialog}
        gymPlans={gymPlans}
        prefill={prefill}
        onSuccess={() => {
          setShowAddSubscriptionDialog(false);
          toast({ title: "Payment successful!", description: "Your subscription has been renewed." });
        }}
        onError={() => {
          setShowAddSubscriptionDialog(false);
          toast({ title: "Payment failed", description: "Your payment could not be processed. Please try again.", variant: "destructive" });
        }}
      />

      <AddAddonDialog
        open={showAddonDialog}
        onOpenChange={setShowAddonDialog}
        gymAddons={gymAddons}
        prefill={prefill}
        onSuccess={() => {
          setShowAddonDialog(false);
          toast({ title: "Payment successful!", description: "Your add-on has been activated." });
        }}
        onError={() => {
          setShowAddonDialog(false);
          toast({ title: "Payment failed", description: "Your payment could not be processed. Please try again.", variant: "destructive" });
        }}
      />
    </div>
  );
}
