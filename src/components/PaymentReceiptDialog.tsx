import { BillingReceiptDialog, BillingReceiptSnapshot } from "@/components/BillingReceiptDialog";
import { Payment } from "@/data/types";

interface PaymentReceiptDialogProps {
  payment: Payment | null;
  gymName?: string;
  gymAddress?: string;
  gymPhone?: string;
  memberName?: string;
  memberId?: number;
  memberPhone?: string;
  onClose: () => void;
}

const invoiceFor = (payment: Payment) => payment.invoice || `INV-${String(payment.id).padStart(4, "0")}`;

const itemFor = (payment: Payment) => payment.planName || payment.itemName || payment.paymentFor || "Gym Package";

export function PaymentReceiptDialog({
  payment,
  gymName,
  gymAddress,
  gymPhone,
  memberName,
  memberId,
  memberPhone,
  onClose,
}: PaymentReceiptDialogProps) {
  const receipt: BillingReceiptSnapshot | null = payment ? {
    number: invoiceFor(payment),
    date: payment.createdAt?.slice(0, 10) || "",
    gymName: gymName || "Gym",
    gymAddress: gymAddress || "",
    gymPhone: gymPhone || "",
    memberId: payment.userId || memberId || 0,
    memberName: payment.userName || memberName || "Unknown",
    memberPhone: memberPhone || "",
    paymentMethod: payment.paymentMethod || "UPI",
    items: [{ id: String(payment.id), description: itemFor(payment), amount: payment.amount }],
    subtotal: payment.amount,
    taxRate: 0,
    cgst: 0,
    sgst: 0,
    total: payment.amount,
  } : null;

  return <BillingReceiptDialog receipt={receipt} onClose={onClose} />;
}
