import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QrCode, Clock, Loader2 } from "lucide-react";
import { useQRToken } from "@/hooks/apis/useAttendance";

interface QRCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QRCodeModal({ open, onOpenChange }: QRCodeModalProps) {
  const { gymName } = useParams<{ gymName: string }>();
  const [countdown, setCountdown] = useState<number>(0);
  const { data: qrData, isLoading: isQRLoading, refetch: refetchQR } = useQRToken();

  useEffect(() => {
    if (!open || !qrData?.expiresAt) return;
    const updateCountdown = () => {
      const diff = Math.max(0, Math.floor((new Date(qrData.expiresAt).getTime() - Date.now()) / 1000));
      setCountdown(diff);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [open, qrData?.expiresAt]);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" /> Attendance QR Code
          </DialogTitle>
          <DialogDescription>
            Members can scan this code to mark their attendance.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-5 py-4">
          {isQRLoading ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Generating QR code…</p>
            </div>
          ) : qrData?.token ? (
            <>
              <div className="rounded-xl overflow-hidden border border-border shadow-md p-2 bg-white">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`${window.location.origin}/mark-attendance?token=${qrData.token}`)}`}
                  alt="Attendance QR Code"
                  width={220}
                  height={220}
                />
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                countdown > 30
                  ? "bg-success/10 text-success"
                  : countdown > 0
                  ? "bg-warning/10 text-warning"
                  : "bg-destructive/10 text-destructive"
              }`}>
                <Clock className="h-4 w-4" />
                {countdown > 0 ? (
                  <span>Expires in <span className="font-mono">{formatCountdown(countdown)}</span></span>
                ) : (
                  <span>Token expired — refresh to get a new one</span>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground py-8">Failed to load QR token.</p>
          )}
        </div>
        <DialogFooter>
          {countdown === 0 && !isQRLoading && (
            <Button variant="outline" onClick={() => refetchQR()} className="mr-auto">
              <Loader2 className="mr-2 h-4 w-4" /> Refresh QR
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
