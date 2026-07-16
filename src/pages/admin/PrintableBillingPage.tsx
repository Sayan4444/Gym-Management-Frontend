import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Calculator, Download, Plus, Receipt, Search, ShieldCheck, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { MembershipPlan, User } from "@/data/types";
import { useAddons, useCreateManualPayment, useGym, useMe, useMembershipPlans, useUsers } from "@/hooks/useApi";

type PaymentMethod = "UPI" | "Cash" | "Card" | "Net Banking";

interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
}

interface ReceiptSnapshot {
  number: string;
  date: string;
  gymName: string;
  gymAddress: string;
  gymPhone: string;
  memberId: number;
  memberName: string;
  memberPhone: string;
  paymentMethod: PaymentMethod;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  cgst: number;
  sgst: number;
  total: number;
}

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

const today = () => new Date().toISOString().slice(0, 10);

function activePlanFor(member: User, plans: MembershipPlan[]) {
  const subscription = member.subscription?.find((item) => item.status === "Active") || member.subscription?.[0];
  return subscription ? plans.find((plan) => plan.id === subscription.planId) : undefined;
}

function ReceiptPreview({ receipt }: { receipt: ReceiptSnapshot }) {
  return (
    <div className="space-y-4 bg-white p-6 font-mono text-black sm:p-8">
      <div className="border-b border-neutral-300 pb-3 text-center">
        <h2 className="font-sans text-xl font-black uppercase">{receipt.gymName}</h2>
        {receipt.gymAddress && <p className="text-[11px] text-neutral-600">{receipt.gymAddress}</p>}
        {receipt.gymPhone && <p className="mt-1 text-[11px] font-bold text-neutral-800">PHONE: {receipt.gymPhone}</p>}
        <p className="mt-3 text-sm font-bold">OFFICIAL TAX INVOICE</p>
      </div>

      <div className="grid grid-cols-1 gap-3 border-b border-neutral-200 pb-3 text-[11px] sm:grid-cols-2 sm:gap-6">
        <div className="space-y-1">
          <div><b>INVOICE NO:</b> {receipt.number}</div>
          <div><b>DATE:</b> {receipt.date}</div>
          <div><b>PAY MODE:</b> {receipt.paymentMethod}</div>
        </div>
        <div className="space-y-1">
          <div><b>MEMBER ID:</b> #{receipt.memberId}</div>
          <div><b>MEMBER:</b> {receipt.memberName}</div>
          <div><b>CONTACT:</b> {receipt.memberPhone || "—"}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-[11px]">
          <thead><tr className="border-b border-neutral-400"><th className="py-2">Description of Gym Services</th><th className="py-2 text-right">Amount (INR)</th></tr></thead>
          <tbody className="divide-y divide-neutral-200">
            {receipt.items.map((item) => <tr key={item.id}><td className="py-2 pr-4">{item.description}</td><td className="py-2 text-right">₹{formatMoney(item.amount)}</td></tr>)}
          </tbody>
        </table>
      </div>

      <div className="space-y-1 border-t border-dashed border-neutral-400 pt-3 text-[11px]">
        <div className="flex justify-between"><span>Sub-total:</span><span>₹{formatMoney(receipt.subtotal)}</span></div>
        {receipt.taxRate > 0 && <>
          <div className="flex justify-between"><span>Central GST (CGST {receipt.taxRate / 2}%):</span><span>₹{formatMoney(receipt.cgst)}</span></div>
          <div className="flex justify-between"><span>State GST (SGST {receipt.taxRate / 2}%):</span><span>₹{formatMoney(receipt.sgst)}</span></div>
        </>}
        <div className="mt-2 flex justify-between border-t border-neutral-300 pt-2 text-xs font-bold"><span>TOTAL BILL AMOUNT:</span><span>₹{formatMoney(receipt.total)}</span></div>
      </div>

      <div className="border-t border-neutral-200 pt-4 font-sans text-[10px] leading-relaxed text-neutral-500">
        <p className="font-semibold text-neutral-700">Declarations & Rules:</p>
        <p>1. Payments made for gym services are subject to the gym&apos;s cancellation and refund policy.</p>
        <p>2. Please retain this receipt for your records.</p>
        <p className="mt-4 text-center font-bold text-neutral-800">— Thank you for your business! —</p>
        <p className="mt-1 text-center text-[8px]">Generated for {receipt.gymName}</p>
      </div>
    </div>
  );
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
  const [finalizedReceipt, setFinalizedReceipt] = useState<ReceiptSnapshot | null>(null);

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

  const downloadReceiptPdf = async () => {
    if (!finalizedReceipt) return;
    const { jsPDF } = await import("jspdf");
    const receipt = finalizedReceipt;
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const left = 18;
    const right = pageWidth - 18;
    let y = 18;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(receipt.gymName.toUpperCase(), pageWidth / 2, y, { align: "center" });
    y += 6;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    if (receipt.gymAddress) { pdf.text(receipt.gymAddress, pageWidth / 2, y, { align: "center", maxWidth: 150 }); y += 5; }
    if (receipt.gymPhone) { pdf.text(`Phone: ${receipt.gymPhone}`, pageWidth / 2, y, { align: "center" }); y += 5; }
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("OFFICIAL TAX INVOICE", pageWidth / 2, y + 2, { align: "center" });
    y += 9;
    pdf.line(left, y, right, y);
    y += 7;

    pdf.setFontSize(9);
    pdf.text(`Invoice No: ${receipt.number}`, left, y);
    pdf.text(`Member ID: #${receipt.memberId}`, 112, y);
    y += 5;
    pdf.setFont("helvetica", "normal");
    pdf.text(`Date: ${receipt.date}`, left, y);
    pdf.text(`Member: ${receipt.memberName}`, 112, y);
    y += 5;
    pdf.text(`Payment mode: ${receipt.paymentMethod}`, left, y);
    pdf.text(`Contact: ${receipt.memberPhone || "-"}`, 112, y);
    y += 7;
    pdf.line(left, y, right, y);
    y += 6;

    pdf.setFont("helvetica", "bold");
    pdf.text("Description of Gym Services", left, y);
    pdf.text("Amount (INR)", right, y, { align: "right" });
    y += 4;
    pdf.line(left, y, right, y);
    y += 6;
    pdf.setFont("helvetica", "normal");
    receipt.items.forEach((item) => {
      const lines = pdf.splitTextToSize(item.description, 125) as string[];
      const rowHeight = Math.max(6, lines.length * 4.5);
      if (y + rowHeight > 265) { pdf.addPage(); y = 20; }
      pdf.text(lines, left, y);
      pdf.text(formatMoney(item.amount), right, y, { align: "right" });
      y += rowHeight;
    });

    y += 2;
    pdf.line(left, y, right, y);
    y += 6;
    pdf.text("Sub-total:", 112, y);
    pdf.text(formatMoney(receipt.subtotal), right, y, { align: "right" });
    if (receipt.taxRate > 0) {
      y += 5;
      pdf.text(`CGST (${receipt.taxRate / 2}%):`, 112, y);
      pdf.text(formatMoney(receipt.cgst), right, y, { align: "right" });
      y += 5;
      pdf.text(`SGST (${receipt.taxRate / 2}%):`, 112, y);
      pdf.text(formatMoney(receipt.sgst), right, y, { align: "right" });
    }
    y += 6;
    pdf.setFont("helvetica", "bold");
    pdf.line(112, y - 4, right, y - 4);
    pdf.text("TOTAL:", 112, y);
    pdf.text(formatMoney(receipt.total), right, y, { align: "right" });
    y += 14;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.text("Please retain this receipt for your records.", pageWidth / 2, y, { align: "center" });
    pdf.setFont("helvetica", "bold");
    pdf.text("Thank you for your business!", pageWidth / 2, y + 5, { align: "center" });
    pdf.save(`${receipt.number}.pdf`);
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

      <AnimatePresence>
        {finalizedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 backdrop-blur-md sm:p-6" role="dialog" aria-modal="true" aria-label="Final bill preview">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6"><div><p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#39FF14]">Final bill preview</p><h3 className="text-sm font-black uppercase text-white">{finalizedReceipt.number}</h3></div><button type="button" onClick={() => setFinalizedReceipt(null)} className="rounded-lg bg-white/5 p-2 text-gray-400 hover:text-white" aria-label="Close bill preview"><X className="h-4 w-4" /></button></div>
              <div className="overflow-y-auto bg-neutral-200 p-3 sm:p-6"><div className="mx-auto max-w-2xl shadow-xl"><ReceiptPreview receipt={finalizedReceipt} /></div></div>
              <div className="flex flex-col-reverse gap-3 border-t border-white/10 p-4 sm:flex-row sm:justify-end"><button type="button" onClick={resetReceipt} className="rounded-xl bg-white/5 px-5 py-3 text-xs font-bold text-white hover:bg-white/10">New Receipt</button><button type="button" onClick={downloadReceiptPdf} className="flex items-center justify-center gap-2 rounded-xl border border-[#39FF14]/40 bg-[#39FF14]/20 px-5 py-3 text-xs font-black text-[#39FF14] hover:bg-[#39FF14]/30"><Download className="h-4 w-4" /> Print / Download PDF</button></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
