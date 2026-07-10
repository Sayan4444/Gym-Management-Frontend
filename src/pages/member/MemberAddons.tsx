import { useState } from "react";
import { CalendarClock, CheckCircle2, Clock, History, Loader2, Package, PackagePlus } from "lucide-react";

import { AddAddonDialog } from "@/components/member/AddAddonDialog";
import { ScheduleAddonDialog } from "@/components/member/ScheduleAddonDialog";
import { UserAddon } from "@/data/types";
import { useAddons, useMe } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

function statusClass(status: string) {
  if (status === "Completed") return "border-[#39FF14]/20 bg-[#39FF14]/10 text-[#39FF14]";
  if (status === "Scheduled" || status === "In Progress") return "border-[#00BFFF]/20 bg-[#00BFFF]/10 text-[#00BFFF]";
  if (status === "Purchased") return "border-amber-400/20 bg-amber-400/10 text-amber-400";
  return "border-white/10 bg-white/5 text-gray-300";
}

function AddonRow({ userAddon, onSchedule, completed = false }: { userAddon: UserAddon; onSchedule: (addon: UserAddon) => void; completed?: boolean }) {
  const scheduledDate = userAddon.scheduledAt
    ? new Date(userAddon.scheduledAt).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className={`flex flex-col gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04] sm:flex-row sm:items-center ${completed ? "opacity-70" : ""}`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00BFFF]/10">
        {completed ? <CheckCircle2 className="h-5 w-5 text-[#39FF14]" /> : <Clock className="h-5 w-5 text-[#00BFFF]" />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-white">{userAddon.addon?.name ?? "Unknown Add-on"}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          {userAddon.addon?.duration ? <span>{userAddon.addon.duration} min</span> : null}
          <span>Purchased {formatDate(userAddon.purchasedAt)}</span>
          {scheduledDate && (
            <span className={`flex items-center gap-1 ${completed ? "text-gray-500" : "text-[#39FF14]"}`}>
              <CheckCircle2 className="h-3 w-3" />
              {scheduledDate}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className={`rounded-full border px-2.5 py-1 font-mono text-[10px] font-black uppercase ${statusClass(userAddon.status)}`}>{userAddon.status}</span>
        {!completed && (
          <button
            type="button"
            onClick={() => onSchedule(userAddon)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black transition-colors ${
              userAddon.status === "Purchased"
                ? "bg-gradient-to-r from-[#00BFFF] to-[#39FF14] text-black"
                : "border border-[#00BFFF]/20 text-[#00BFFF] hover:bg-[#00BFFF]/10"
            }`}
          >
            <CalendarClock className="h-3.5 w-3.5" />
            {userAddon.status === "Purchased" ? "Schedule" : "Reschedule"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function MemberAddons() {
  const { data: me, isLoading } = useMe({ include: "gym,subscription,user_addon" });
  const gymAddons = useAddons(me?.gymId).data?.addons || [];
  const userAddons: UserAddon[] = me?.userAddon || [];
  const prefill = { name: me?.name, email: me?.email, contact: me?.phone };
  const { toast } = useToast();

  const [showAddonDialog, setShowAddonDialog] = useState(false);
  const [scheduleTarget, setScheduleTarget] = useState<UserAddon | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00BFFF]" />
      </div>
    );
  }

  const activeAddons = userAddons.filter((addon) => addon.status !== "Completed");
  const completedAddons = userAddons.filter((addon) => addon.status === "Completed");
  const scheduled = activeAddons.filter((addon) => addon.status === "Scheduled" || addon.status === "In Progress");
  const unscheduled = activeAddons.filter((addon) => addon.status === "Purchased");

  return (
    <div className="space-y-6" id="member-addons-panel">
      <div className="glass-card flex flex-col justify-between gap-4 rounded-2xl border border-white/5 bg-gradient-to-tr from-[#111] to-[#00BFFF]/5 p-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="mt-1 text-xl font-black uppercase tracking-tight text-white">My Add-ons</h1>
        </div>
        <button
          type="button"
          onClick={() => setShowAddonDialog(true)}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#39FF14] px-4 py-2.5 text-xs font-black text-black transition-opacity hover:opacity-90"
          id="buy-addon-btn"
        >
          <PackagePlus className="h-4 w-4" />
          Buy New Add-on
        </button>
      </div>

      {activeAddons.length === 0 && completedAddons.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#0a0a0a] px-6 py-16 text-center shadow-2xl">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#00BFFF]/20 bg-[#00BFFF]/10">
            <Package className="h-8 w-8 text-[#00BFFF]" />
          </div>
          <p className="text-lg font-black text-white">No add-ons yet</p>
          <p className="mt-1 text-sm text-gray-500">Purchase an add-on to unlock extra sessions and services.</p>
          <button
            type="button"
            onClick={() => setShowAddonDialog(true)}
            className="mt-5 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#39FF14] px-4 py-2.5 text-xs font-black text-black"
          >
            <PackagePlus className="h-4 w-4" />
            Buy Add-on
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {scheduled.length > 0 && (
            <section className="glass-card rounded-2xl border border-white/5 bg-[#0a0a0a] p-5 shadow-2xl">
              <div className="mb-4 border-b border-white/5 pb-3">
                <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-white">
                  <CalendarClock className="h-4 w-4 text-[#00BFFF]" />
                  Scheduled Sessions
                  <span className="rounded-full border border-[#00BFFF]/20 bg-[#00BFFF]/10 px-2 py-0.5 font-mono text-[10px] text-[#00BFFF]">{scheduled.length}</span>
                </h2>
                <p className="mt-1 text-xs text-gray-500">These sessions have a confirmed date and time</p>
              </div>
              <div className="space-y-2">{scheduled.map((addon) => <AddonRow key={addon.id} userAddon={addon} onSchedule={setScheduleTarget} />)}</div>
            </section>
          )}

          {unscheduled.length > 0 && (
            <section className="glass-card rounded-2xl border border-white/5 bg-[#0a0a0a] p-5 shadow-2xl">
              <div className="mb-4 border-b border-white/5 pb-3">
                <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-white">
                  <Clock className="h-4 w-4 text-amber-400" />
                  Awaiting Scheduling
                  <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 font-mono text-[10px] text-amber-400">{unscheduled.length}</span>
                </h2>
              </div>
              <div className="space-y-2">{unscheduled.map((addon) => <AddonRow key={addon.id} userAddon={addon} onSchedule={setScheduleTarget} />)}</div>
            </section>
          )}

          {completedAddons.length > 0 && (
            <section className="glass-card rounded-2xl border border-white/5 bg-[#0a0a0a] p-5 shadow-2xl">
              <div className="mb-4 border-b border-white/5 pb-3">
                <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-white">
                  <History className="h-4 w-4 text-gray-500" />
                  Completed Sessions
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-gray-300">{completedAddons.length}</span>
                </h2>
              </div>
              <div className="space-y-2">{completedAddons.map((addon) => <AddonRow key={addon.id} userAddon={addon} onSchedule={setScheduleTarget} completed />)}</div>
            </section>
          )}
        </div>
      )}

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

      <ScheduleAddonDialog
        userAddon={scheduleTarget}
        open={Boolean(scheduleTarget)}
        onOpenChange={(open) => {
          if (!open) setScheduleTarget(null);
        }}
      />
    </div>
  );
}
