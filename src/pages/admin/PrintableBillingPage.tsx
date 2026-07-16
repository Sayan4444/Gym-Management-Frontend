import { useMemo, useState } from "react";
import { Calculator, Plus, Receipt, Search, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { BillingReceiptDialog, BillingReceiptSnapshot } from "@/components/BillingReceiptDialog";
import { MembershipPlan, User } from "@/data/types";
import { useAddons, useCreateManualPayment, useGym, useMe, useMembershipPlans, useUsers } from "@/hooks/useApi";

type PaymentMethod = "UPI" | "Cash" | "Card" | "Net Banking";

interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
}

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

const today = () => new Date().toISOString().slice(0, 10);

function activePlanFor(member: User, plans: MembershipPlan[]) {
  const subscription = member.subscription?.find((item) => item.status === "Active") || member.subscription?.[0];
  return subscription ? plans.find((plan) => plan.id === subscription.planId) : undefined;
}

export default function PrintableBillingPage() {
  const { data: me } = useMe();
  const { data: gym } = useGym(me?.gymId);
  const membersQuery = useUsers({ role: "Member", include: "subscription" });
  const plansQuery = useMembershipPlans(me?.gymId);
  const addonsQuery = useAddons(me?.gymId);
  const manualPayment = useCreateManualPayment();

  const members = useMemo(() => membersQuery.data?.users || [], [membersQuery.data?.users]);
  const plans = plansQuery.data?.memberships?.filter((plan) => plan.isActive) || [];
  const addons = addonsQuery.data?.addons?.filter((addon) => addon.isActive) || [];

  const [memberSearch, setMemberSearch] = useState("");
  const [memberSuggestionsOpen, setMemberSuggestionsOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedAddonId, setSelectedAddonId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [taxRate, setTaxRate] = useState(18);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");
  const [finalizedReceipt, setFinalizedReceipt] = useState<BillingReceiptSnapshot | null>(null);

  const selectedMember = members.find((member) => String(member.id) === selectedMemberId);
  const filteredMembers = useMemo(() => {
    const query = memberSearch.trim().toLowerCase();
    if (!query) return members.slice(0, 8);
    return members.filter((member) => [member.name, member.email, member.phone, member.id].join(" ").toLowerCase().includes(query)).slice(0, 8);
  }, [memberSearch, members]);
  const subtotal = useMemo(() => items.reduce((total, item) => total + item.amount, 0), [items]);
  const totalTax = Number(((subtotal * taxRate) / 100).toFixed(2));
  const cgst = Number((totalTax / 2).toFixed(2));
  const sgst = Number((totalTax / 2).toFixed(2));
  const netTotal = subtotal + totalTax;

  const setPlanItem = (plan: MembershipPlan | undefined, baseItems: InvoiceItem[] = items) => {
    const withoutPlan = baseItems.filter((item) => !item.id.startsWith("plan-"));
    setItems(plan ? [...withoutPlan, { id: `plan-${plan.id}`, description: `${plan.name} Access`, amount: plan.price }] : withoutPlan);
  };

  const chooseMember = (member: User) => {
    setSelectedMemberId(String(member.id));
    setMemberSearch(`${member.name} (#${member.id})`);
    setMemberSuggestionsOpen(false);
    setFinalizedReceipt(null);
    const plan = activePlanFor(member, plans);
    setSelectedPlanId(plan ? String(plan.id) : "");
    setPlanItem(plan, []);
  };

  const changeMemberSearch = (value: string) => {
    setMemberSearch(value);
    setMemberSuggestionsOpen(true);
    if (selectedMemberId) {
      setSelectedMemberId("");
      setSelectedPlanId("");
      setSelectedAddonId("");
      setItems([]);
      setFinalizedReceipt(null);
    }
  };

  const selectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setFinalizedReceipt(null);
    setPlanItem(plans.find((plan) => String(plan.id) === planId));
  };

  const addItem = (description: string, amount: number, prefix = "custom") => {
    if (!selectedMember || !description.trim() || amount <= 0) return;
    setItems((current) => [...current, { id: `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, description: description.trim(), amount }]);
    setNewItemDescription("");
    setNewItemAmount("");
    setFinalizedReceipt(null);
  };

  const addSelectedAddon = () => {
    const addon = addons.find((candidate) => String(candidate.id) === selectedAddonId);
    if (!addon) return;
    addItem(addon.name, addon.price, `addon-${addon.id}`);
    setSelectedAddonId("");
  };

  const finalizeReceipt = () => {
    if (!selectedMember || items.length === 0) return;
    manualPayment.mutate({
      userId: selectedMember.id,
      amount: netTotal,
      planId: selectedPlanId ? Number(selectedPlanId) : undefined,
      paymentMethod,
    }, {
      onSuccess: (response) => {
        setFinalizedReceipt({
          number: response.invoice,
          date: today(),
          gymName: gym?.name || "Gym",
          gymAddress: gym?.address || "",
          gymPhone: gym?.phone || "",
          memberId: selectedMember.id,
          memberName: selectedMember.name,
          memberPhone: selectedMember.phone || "",
          paymentMethod,
          items: items.map((item) => ({ ...item })),
          subtotal,
          taxRate,
          cgst,
          sgst,
          total: netTotal,
        });
        toast.success("Payment recorded successfully");
      },
      onError: (error) => toast.error(error.message || "Failed to record payment"),
    });
  };

  const resetReceipt = () => {
    setFinalizedReceipt(null);
    setMemberSearch("");
    setSelectedMemberId("");
    setSelectedPlanId("");
    setSelectedAddonId("");
    setItems([]);
  };

  return (
    <div className="space-y-8" id="billing-management-root">
      <section className="relative overflow-hidden rounded-3xl border border-[#E5A823]/15 bg-gradient-to-tr from-[#0b0b0b]/90 to-[#E5A823]/5 p-6 shadow-2xl">
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-gradient-to-br from-[#E5A823]/5 to-transparent blur-3xl" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E5A823]/30 bg-[#E5A823]/10 text-[#E5A823]"><Receipt className="h-6 w-6" /></div>
          <div><span className="rounded bg-[#E5A823]/15 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#E5A823]">GST billing desk</span><h2 className="mt-1 text-xl font-extrabold uppercase tracking-tight text-white">Printable Gym Receipt Console</h2></div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl space-y-6 rounded-2xl border border-white/5 bg-[#090909] p-6 shadow-xl">
        <h3 className="flex items-center gap-2 border-b border-white/5 pb-3 font-mono text-xs font-bold uppercase tracking-widest text-white"><Calculator className="h-4 w-4 text-[#00BFFF]" /> Configure Bill Parameters</h3>

        <div className="relative space-y-2">
          <label htmlFor="billing-member-selector" className="block text-xs font-bold text-gray-400">1. Gym Member</label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              id="billing-member-selector"
              role="combobox"
              aria-expanded={memberSuggestionsOpen}
              aria-controls="billing-member-suggestions"
              autoComplete="off"
              value={memberSearch}
              onFocus={() => setMemberSuggestionsOpen(true)}
              onBlur={() => window.setTimeout(() => setMemberSuggestionsOpen(false), 150)}
              onChange={(event) => changeMemberSearch(event.target.value)}
              placeholder="Type a member name, ID, phone, or email…"
              className="w-full rounded-xl border border-white/10 bg-[#111] py-3 pl-10 pr-4 text-xs text-white placeholder:text-gray-600 focus:border-[#E5A823] focus:outline-none"
            />
          </div>
          {memberSuggestionsOpen && (
            <div id="billing-member-suggestions" role="listbox" className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-white/10 bg-[#151515] p-1 shadow-2xl">
              {filteredMembers.map((member) => <button key={member.id} type="button" role="option" aria-selected={String(member.id) === selectedMemberId} onMouseDown={(event) => event.preventDefault()} onClick={() => chooseMember(member)} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left hover:bg-white/5"><span><span className="block text-xs font-bold text-white">{member.name}</span><span className="text-[10px] text-gray-500">#{member.id} · {member.email}</span></span><span className="text-[10px] text-gray-400">{member.phone || "No phone"}</span></button>)}
              {!membersQuery.isLoading && filteredMembers.length === 0 && <p className="px-3 py-4 text-center text-xs text-gray-500">No matching members found.</p>}
              {membersQuery.isLoading && <p className="px-3 py-4 text-center text-xs text-gray-500">Loading members…</p>}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2"><label htmlFor="billing-plan-selector" className="block text-xs font-bold text-gray-400">2. Base Plan</label><select id="billing-plan-selector" value={selectedPlanId} onChange={(event) => selectPlan(event.target.value)} disabled={!selectedMember} className="w-full rounded-xl border border-white/10 bg-[#111] p-3 text-xs text-white focus:border-[#00BFFF] focus:outline-none disabled:opacity-50"><option value="">-- Select Access Term --</option>{plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name} (₹{formatMoney(plan.price)})</option>)}</select></div>
          <div className="space-y-2"><label htmlFor="billing-payment-method" className="block text-xs font-bold text-gray-400">3. Payment Category</label><select id="billing-payment-method" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)} className="w-full rounded-xl border border-white/10 bg-[#111] p-3 text-xs text-white focus:border-[#39FF14] focus:outline-none"><option value="UPI">UPI (GPay / PhonePe)</option><option value="Cash">Cash Receipt</option><option value="Card">POS Card Swipe</option><option value="Net Banking">Net Banking</option></select></div>
        </div>

        <div className="space-y-2"><label htmlFor="billing-addon-selector" className="block text-xs font-bold text-gray-400">4. Add-Ons</label><div className="flex flex-col gap-3 sm:flex-row"><select id="billing-addon-selector" value={selectedAddonId} onChange={(event) => setSelectedAddonId(event.target.value)} disabled={!selectedMember || addons.length === 0} className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#111] p-3 text-xs text-white focus:border-[#39FF14] focus:outline-none disabled:opacity-50"><option value="">-- Select an Add-On --</option>{addons.map((addon) => <option key={addon.id} value={addon.id}>{addon.name} (₹{formatMoney(addon.price)})</option>)}</select><button type="button" onClick={addSelectedAddon} disabled={!selectedAddonId || !selectedMember} className="flex items-center justify-center gap-1 rounded-xl border border-[#39FF14]/30 bg-[#39FF14]/10 px-5 py-3 text-xs font-bold text-[#39FF14] hover:bg-[#39FF14]/20 disabled:opacity-40"><Plus className="h-4 w-4" /> Add Add-On</button></div>{addonsQuery.isLoading && <p className="text-[10px] text-gray-500">Loading add-ons…</p>}{!addonsQuery.isLoading && addons.length === 0 && <p className="text-[10px] italic text-gray-500">No active add-ons are configured for this gym.</p>}</div>

        <div className="space-y-3.5 pt-2">
          <p className="text-xs font-bold text-gray-400">5. Custom Item</p>
          <div className="grid grid-cols-1 gap-3 border-b border-white/5 pb-4 sm:grid-cols-12"><input value={newItemDescription} onChange={(event) => setNewItemDescription(event.target.value)} disabled={!selectedMember} placeholder="Item Description…" className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-xs text-white focus:outline-none disabled:opacity-50 sm:col-span-7" /><input type="number" min="0" step="0.01" value={newItemAmount} onChange={(event) => setNewItemAmount(event.target.value)} disabled={!selectedMember} placeholder="Price (₹)" className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5 font-mono text-xs text-white focus:outline-none disabled:opacity-50 sm:col-span-3" /><button type="button" onClick={() => addItem(newItemDescription, Number(newItemAmount))} disabled={!selectedMember || !newItemDescription.trim() || Number(newItemAmount) <= 0} className="flex items-center justify-center gap-1 rounded-lg border border-[#00BFFF]/40 bg-[#00BFFF]/20 px-3 py-2.5 text-xs font-black text-[#00BFFF] hover:bg-[#00BFFF]/30 disabled:opacity-40 sm:col-span-2"><Plus className="h-4 w-4" /> Add</button></div>
          <p className="text-xs font-bold text-gray-400">6. Itemized Breakdown ({items.length} items)</p>
          <div className="max-h-[240px] space-y-2 overflow-y-auto pr-2">{items.map((item) => <div key={item.id} className="flex items-center justify-between border-b border-white/[0.03] py-2 text-xs"><span className="truncate pr-4 font-medium text-white">{item.description}</span><div className="flex shrink-0 items-center gap-3"><span className="font-mono text-gray-400">₹{formatMoney(item.amount)}</span><button type="button" onClick={() => { setItems((current) => current.filter((candidate) => candidate.id !== item.id)); setFinalizedReceipt(null); }} className="p-1 text-red-500 hover:text-red-400" aria-label={`Remove ${item.description}`}><Trash2 className="h-3.5 w-3.5" /></button></div></div>)}{items.length === 0 && <p className="py-4 text-center text-xs italic text-gray-500">Select a plan or add-on, or enter a custom item.</p>}</div>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-white/5 pt-4 text-xs sm:flex-row sm:items-center"><span className="font-medium text-gray-400">Standard India Gym Service Tax (GST)</span><div className="flex gap-2"><button type="button" onClick={() => { setTaxRate(0); setFinalizedReceipt(null); }} className={`rounded px-2.5 py-1 font-mono text-[10px] ${taxRate === 0 ? "border border-[#39FF14]/35 bg-[#39FF14]/20 text-[#39FF14]" : "bg-white/5 text-gray-400"}`}>0% Exempt</button><button type="button" onClick={() => { setTaxRate(18); setFinalizedReceipt(null); }} className={`rounded px-2.5 py-1 font-mono text-[10px] ${taxRate === 18 ? "border border-[#E5A823]/35 bg-[#E5A823]/20 text-[#E5A823]" : "bg-white/5 text-gray-400"}`}>18% GST</button></div></div>

        <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4 font-mono text-xs">
          <div className="flex justify-between py-1.5 text-gray-400"><span>Subtotal</span><span className="text-white">₹{formatMoney(subtotal)}</span></div>
          {taxRate > 0 && <>
            <div className="flex justify-between py-1.5 text-gray-400"><span>CGST ({taxRate / 2}%)</span><span className="text-white">₹{formatMoney(cgst)}</span></div>
            <div className="flex justify-between py-1.5 text-gray-400"><span>SGST ({taxRate / 2}%)</span><span className="text-white">₹{formatMoney(sgst)}</span></div>
          </>}
          <div className="mt-2 flex justify-between border-t border-white/10 pt-3 text-sm font-black"><span className="uppercase text-white">Final Amount</span><span className="text-[#39FF14]">₹{formatMoney(netTotal)}</span></div>
        </div>

        <button type="button" onClick={finalizeReceipt} disabled={!selectedMember || items.length === 0 || manualPayment.isPending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFF2B2] via-[#E5A823] to-[#B37D14] py-3.5 text-xs font-black uppercase tracking-wider text-black hover:opacity-95 disabled:pointer-events-none disabled:opacity-40"><ShieldCheck className="h-4 w-4" /> {manualPayment.isPending ? "Recording Payment…" : "Validate & Finalize Cash Receipt"}</button>
      </section>

      <BillingReceiptDialog
        receipt={finalizedReceipt}
        onClose={() => setFinalizedReceipt(null)}
        secondaryActionLabel="New Receipt"
        onSecondaryAction={resetReceipt}
      />
    </div>
  );
}
