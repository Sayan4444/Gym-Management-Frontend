import { useMemo, useState } from "react";
import { Eye, Loader2, Search } from "lucide-react";

import { PaginationFooter } from "@/components/PaginationFooter";
import { PaymentReceiptDialog } from "@/components/PaymentReceiptDialog";
import { Payment } from "@/data/types";
import { useAddons, useMe, useMembershipPlansByGym, usePayments } from "@/hooks/useApi";
import { formatDate } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

function statusClass(status: string) {
  if (status === "Paid") return "border-[#39FF14]/20 bg-[#39FF14]/10 text-[#39FF14]";
  if (status === "Pending" || status === "Created") return "border-amber-400/20 bg-amber-400/10 text-amber-400";
  if (status === "Failed" || status === "Overdue") return "border-red-400/20 bg-red-400/10 text-red-400";
  return "border-white/10 bg-white/5 text-gray-300";
}

export default function MemberOrderHistory() {
  const { data: paymentsData, isLoading: isPaymentsLoading } = usePayments();
  const payments = useMemo(() => paymentsData?.payments ?? [], [paymentsData?.payments]);
  const { data: me, isLoading: isAuthLoading } = useMe();
  const plansData = useMembershipPlansByGym(me?.gymId).data;
  const addonsData = useAddons(me?.gymId).data;
  const gymPlans = useMemo(() => plansData?.memberships ?? [], [plansData?.memberships]);
  const gymAddons = useMemo(() => addonsData?.addons ?? [], [addonsData?.addons]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return payments;

    return payments.filter((payment) =>
      [
        payment.invoice,
        payment.id,
        payment.paymentFor,
        payment.status,
        payment.planName,
        payment.itemName,
        payment.planId ? gymPlans.find((plan) => plan.id === payment.planId)?.name : "",
        payment.addonId ? gymAddons.find((addon) => addon.id === payment.addonId)?.name : "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [gymAddons, gymPlans, payments, search]);

  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const pagedPayments = filteredPayments.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (isPaymentsLoading || isAuthLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00BFFF]" />
      </div>
    );
  }

  return (
    <div className="space-y-6" id="member-orders-panel">
      <div className="glass-card rounded-2xl border border-white/5 bg-gradient-to-tr from-[#111] to-[#00BFFF]/5 p-5">
        <h1 className="text-xl font-black uppercase tracking-tight text-white">Order History</h1>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 p-5 shadow-xl">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Filter payments by invoice, item, type, or status..."
            className="w-full rounded-xl border border-white/5 bg-white/[0.03] py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-gray-500 focus:border-[#00BFFF]/50 focus:outline-none"
            id="member-order-search"
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] font-mono text-[10px] uppercase tracking-widest text-gray-500">
                <th className="p-4">Invoice</th>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment For</th>
                <th className="p-4">Item</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Get Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {pagedPayments.map((payment) => {
                const item =
                  payment.planName ||
                  payment.itemName ||
                  (payment.planId ? gymPlans.find((plan) => plan.id === payment.planId)?.name : "") ||
                  (payment.addonId ? gymAddons.find((addon) => addon.id === payment.addonId)?.name : "") ||
                  "-";

                return (
                  <tr key={payment.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="p-4 font-mono font-bold text-white">{payment.invoice || `INV-${String(payment.id).padStart(4, "0")}`}</td>
                    <td className="p-4 text-gray-400">{formatDate(payment.createdAt)}</td>
                    <td className="p-4 font-mono font-black text-white">₹{payment.amount.toFixed(2)}</td>
                    <td className="p-4 text-gray-300">{payment.paymentFor}</td>
                    <td className="p-4 text-gray-400">{item}</td>
                    <td className="p-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 font-mono text-[10px] font-black uppercase ${statusClass(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedPayment(payment)}
                        className="rounded-lg border border-white/5 bg-white/[0.01] p-1.5 text-gray-400 transition-colors hover:border-[#00BFFF]/40 hover:text-white"
                        title="View Detailed Receipt"
                        aria-label={`Get receipt for ${payment.invoice || `invoice ${payment.id}`}`}
                      >
                        <Eye className="inline h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {pagedPayments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-xs text-gray-500">
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredPayments.length > 0 && (
          <div className="border-t border-white/5 px-4 py-3">
            <PaginationFooter page={page} totalPages={totalPages} setPage={setPage} itemsPerPage={ITEMS_PER_PAGE} totalItems={filteredPayments.length} itemName="payments" />
          </div>
        )}
      </div>

      <PaymentReceiptDialog
        payment={selectedPayment}
        gymName={me?.gym?.name}
        gymAddress={me?.gym?.address}
        gymPhone={me?.gym?.phone}
        memberName={me?.name}
        memberId={me?.id}
        memberPhone={me?.phone}
        onClose={() => setSelectedPayment(null)}
      />
    </div>
  );
}
