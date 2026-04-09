import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateOrder, useVerifyPayment } from "@/hooks/apis/usePayment";
import { MembershipPlan, Addon } from "@/data/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentType = "Membership Plan" | "Add-On";

interface RazorpayHandlerResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayButtonProps {
  /** The plan or add-on to purchase. */
  item: MembershipPlan | Addon;
  /** Whether this is a membership plan or an add-on. */
  type: PaymentType;
  /** Prefill values for the Razorpay checkout form. */
  prefill?: { name?: string; email?: string; contact?: string };
  /** Called after the payment has been fully verified (or modal dismissed). */
  onSuccess?: () => void;
  /** Called if the payment flow throws an error. */
  onError?: (err: unknown) => void;
  /** Additional class names for the button. */
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Lazily injects the Razorpay checkout script (idempotent). */
function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById("razorpay-checkout-js")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout script"));
    document.body.appendChild(script);
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * A drop-in "Buy Now" button that runs the full Razorpay payment flow:
 *
 *  1. POST /payment/create-order  → get razorpay_order_id
 *  2. Open Razorpay checkout UI
 *  3. POST /payment/verify        → validate HMAC signature
 *  4. Invalidate ["me"] query     → UI refreshes automatically
 *
 * Usage:
 * ```tsx
 * <RazorpayButton
 *   item={plan}
 *   type="Membership Plan"
 *   prefill={{ name: me?.name, email: me?.email, contact: me?.phone }}
 *   onSuccess={() => setShowDialog(false)}
 * />
 * ```
 */
export function RazorpayButton({
  item,
  type,
  prefill = {},
  onSuccess,
  onError,
  className,
}: RazorpayButtonProps) {
  const [isPaying, setIsPaying] = useState(false);

  const queryClient = useQueryClient();
  const createOrder = useCreateOrder();
  const verifyPayment = useVerifyPayment();

  async function handleClick() {
    setIsPaying(true);
    try {
      // ── Step 1: Create order on backend ─────────────────────────────────────
      const orderPayload: Record<string, unknown> = {
        amount: item.price,
        paymentFor: type,
        ...(type === "Membership Plan" ? { planId: item.id } : { addonId: item.id }),
      };

      const orderRes = (await createOrder.mutateAsync(orderPayload as never)) as {
        orderId: string;
        amount: number;
        currency: string;
      };

      const { orderId: razorpayOrderId, amount, currency } = orderRes;

      // ── Step 2: Load SDK & open checkout ────────────────────────────────────
      await loadRazorpayScript();

      await new Promise<void>((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Razorpay = (window as any).Razorpay;
        if (!Razorpay) {
          reject(new Error("Razorpay SDK not available"));
          return;
        }

        const description =
          type === "Membership Plan"
            ? `Plan: ${(item as MembershipPlan).name}`
            : `Add-On: ${(item as Addon).name}`;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID as string,
          amount: amount * 100, // backend returns INR, Razorpay expects paise
          currency,
          name: "Gym Management",
          description,
          order_id: razorpayOrderId,
          prefill: {
            name: prefill.name ?? "",
            email: prefill.email ?? "",
            contact: prefill.contact ?? "",
          },
          // ── Step 3: Verify on backend after successful payment ──────────────
          handler: async (response: RazorpayHandlerResponse) => {
            try {
              await verifyPayment.mutateAsync({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              } as never);

              // ── Step 4: Refresh member data ─────────────────────────────────
              queryClient.invalidateQueries({ queryKey: ["me"] });
              onSuccess?.();
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            // Dismissing the modal is not an error — just resolve quietly
            ondismiss: () => resolve(),
          },
        };

        const rzp = new Razorpay(options);
        rzp.on("payment.failed", () => reject(new Error("Payment failed")));
        rzp.open();
      });
    } catch (err) {
      console.error("[RazorpayButton] Payment error:", err);
      onError?.(err);
    } finally {
      setIsPaying(false);
    }
  }

  return (
    <Button
      size="sm"
      disabled={isPaying}
      onClick={handleClick}
      className={className}
    >
      {isPaying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buy Now"}
    </Button>
  );
}
