import { AnimatePresence, motion } from "motion/react";
import { Download, X } from "lucide-react";

export interface BillingReceiptItem {
  id: string;
  description: string;
  amount: number;
}

export interface BillingReceiptSnapshot {
  number: string;
  date: string;
  gymName: string;
  gymAddress: string;
  gymPhone: string;
  memberId: number;
  memberName: string;
  memberPhone: string;
  paymentMethod: string;
  items: BillingReceiptItem[];
  subtotal: number;
  taxRate: number;
  cgst: number;
  sgst: number;
  total: number;
}

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

export function BillingReceiptPreview({ receipt }: { receipt: BillingReceiptSnapshot }) {
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

async function downloadReceiptPdf(receipt: BillingReceiptSnapshot) {
  const { jsPDF } = await import("jspdf");
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
}

interface BillingReceiptDialogProps {
  receipt: BillingReceiptSnapshot | null;
  onClose: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function BillingReceiptDialog({ receipt, onClose, secondaryActionLabel = "Close", onSecondaryAction }: BillingReceiptDialogProps) {
  return (
    <AnimatePresence>
      {receipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 backdrop-blur-md sm:p-6" role="dialog" aria-modal="true" aria-label="Final bill preview">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6"><div><p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#39FF14]">Final bill preview</p><h3 className="text-sm font-black uppercase text-white">{receipt.number}</h3></div><button type="button" onClick={onClose} className="rounded-lg bg-white/5 p-2 text-gray-400 hover:text-white" aria-label="Close bill preview"><X className="h-4 w-4" /></button></div>
            <div className="overflow-y-auto bg-neutral-200 p-3 sm:p-6"><div className="mx-auto max-w-2xl shadow-xl"><BillingReceiptPreview receipt={receipt} /></div></div>
            <div className="flex flex-col-reverse gap-3 border-t border-white/10 p-4 sm:flex-row sm:justify-end"><button type="button" onClick={onSecondaryAction || onClose} className="rounded-xl bg-white/5 px-5 py-3 text-xs font-bold text-white hover:bg-white/10">{secondaryActionLabel}</button><button type="button" onClick={() => downloadReceiptPdf(receipt)} className="flex items-center justify-center gap-2 rounded-xl border border-[#39FF14]/40 bg-[#39FF14]/20 px-5 py-3 text-xs font-black text-[#39FF14] hover:bg-[#39FF14]/30"><Download className="h-4 w-4" /> Print / Download PDF</button></div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
