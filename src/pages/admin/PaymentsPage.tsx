import { useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";

import { PaymentReceiptDialog } from "@/components/PaymentReceiptDialog";
import { Payment } from "@/data/types";
import { useMe, usePayments } from "@/hooks/useApi";
import { formatDate } from "@/lib/utils";

type StatusFilter = "All" | "Paid" | "Pending" | "Overdue" | "Failed" | "Created";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number.isFinite(amount) ? amount : 0);

const invoiceFor = (payment: Payment) => payment.invoice || `INV-${String(payment.id).padStart(4, "0")}`;

const itemFor = (payment: Payment) => payment.planName || payment.itemName || payment.paymentFor || "Gym Package";

function statusClass(status: string) {
  if (status === "Paid") return "border-[#39FF14]/10 bg-[#39FF14]/10 text-[#39FF14]";
  if (status === "Pending" || status === "Created") return "border-amber-400/10 bg-amber-400/10 text-amber-400";
  if (status === "Overdue" || status === "Failed") return "border-red-400/10 bg-red-400/10 text-red-400";
  return "border-white/10 bg-white/5 text-gray-400";
}

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [selectedInvoice, setSelectedInvoice] = useState<Payment | null>(null);

  const { data: me } = useMe();
  const paymentsData = usePayments().data?.payments;
  const payments = useMemo(() => paymentsData || [], [paymentsData]);

  const filteredPayments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return payments.filter((payment) => {
      const invoice = invoiceFor(payment).toLowerCase();
      const searchText = [
        payment.userName,
        payment.userId,
        payment.id,
        invoice,
        itemFor(payment),
        payment.paymentFor,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchText.includes(query);
      const matchesStatus = statusFilter === "All" || payment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, searchQuery, statusFilter]);

  return (
    <div className="space-y-6" id="payment-management-panel">
      <div className="glass-card flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-white/5 p-5 shadow-xl md:flex-row md:items-center">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by Invoice, Client Name or ID..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-xl border border-white/5 bg-white/[0.03]/90 py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-gray-500 focus:outline-none"
              id="payment-search-input"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            className="rounded-xl border border-white/5 bg-[#111] p-2.5 text-xs text-gray-400 focus:outline-none"
            id="payment-status-filter"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid Ledger</option>
            <option value="Pending">Pending Invoices</option>
            <option value="Overdue">Overdue Alerts</option>
            <option value="Failed">Failed Payments</option>
            <option value="Created">Created Orders</option>
          </select>
        </div>
      </div>

      <div className="glass-card overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <th className="p-4">Invoice No</th>
                <th className="p-4">Member</th>
                <th className="p-4 font-mono">Date</th>
                <th className="p-4">Plan/ Addon name</th>
                <th className="p-4 font-mono">Amount</th>
                <th className="p-4 text-center">Receipt Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-white/[0.01]">
                  <td className="p-4 font-mono font-bold text-white">{invoiceFor(payment)}</td>
                  <td className="p-4">
                    <p className="font-bold text-white transition-colors hover:text-[#00BFFF]">{payment.userName || "Unknown"}</p>
                    <span className="font-mono text-[10px] text-gray-500">#{payment.userId}</span>
                  </td>
                  <td className="p-4 font-mono text-gray-400">{formatDate(payment.createdAt)}</td>
                  <td className="p-4 text-gray-300">{itemFor(payment)}</td>
                  <td className="p-4 font-mono font-black text-white">₹{formatCurrency(payment.amount)}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-black uppercase ${statusClass(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedInvoice(payment)}
                      className="rounded-lg border border-white/5 bg-white/[0.01] p-1.5 text-gray-400 transition-colors hover:border-[#00BFFF]/40 hover:text-white"
                      title="View Detailed Receipt"
                    >
                      <Eye className="inline h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-xs text-gray-500">
                    No payment records found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PaymentReceiptDialog
        payment={selectedInvoice}
        gymName={me?.gym?.name}
        gymAddress={me?.gym?.address}
        gymPhone={me?.gym?.phone}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
}
