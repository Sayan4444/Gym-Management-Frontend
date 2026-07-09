import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, CalendarClock, Clock, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useScheduleUserAddon } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import type { UserAddon } from "@/data/types";
import { cn } from "@/lib/utils";

interface ScheduleAddonDialogProps {
  userAddon: UserAddon | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatScheduled(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const TIME_SLOTS = Array.from({ length: 25 }).map((_, i) => {
  const hour = 10 + Math.floor(i / 2);
  const min = i % 2 === 0 ? "00" : "30";
  const ampm = hour >= 12 ? "PM" : "AM";
  const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${String(h).padStart(2, "0")}:${min} ${ampm}`;
});

export function ScheduleAddonDialog({ userAddon, open, onOpenChange }: ScheduleAddonDialogProps) {
  const { toast } = useToast();
  const schedule = useScheduleUserAddon();

  const existing = userAddon?.scheduledAt;
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (open && existing) {
      const d = new Date(existing);
      setDate(d);
      
      const hour = d.getHours();
      const min = d.getMinutes();
      const ampm = hour >= 12 ? "PM" : "AM";
      const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const timeStr = `${String(h).padStart(2, "0")}:${min < 30 ? "00" : "30"} ${ampm}`;
      
      if (TIME_SLOTS.includes(timeStr)) {
        setTime(timeStr);
      } else {
        setTime(undefined);
      }
    } else if (open) {
      setDate(undefined);
      setTime(undefined);
    }
  }, [open, existing]);

  if (!userAddon) return null;

  const addonName = userAddon.addon?.name ?? "Addon";
  const duration = userAddon.addon?.duration;

  const handleSave = () => {
    if (!date || !time) return;
    
    // Parse time
    const [timeStr, ampm] = time.split(" ");
    let [hours, minutes] = timeStr.split(":").map(Number);
    if (ampm === "PM" && hours !== 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    
    const finalDate = new Date(date);
    finalDate.setHours(hours, minutes, 0, 0);
    
    const iso = finalDate.toISOString();
    
    schedule.mutate(
      { id: userAddon.id, payload: { scheduledAt: iso } },
      {
        onSuccess: () => {
          toast({ title: "Session scheduled!", description: `${addonName} scheduled for ${formatScheduled(iso)}.` });
          onOpenChange(false);
        },
        onError: (e: any) => {
          toast({ title: "Failed to schedule", description: e?.message ?? "Please try again.", variant: "destructive" });
        },
      }
    );
  };

  const handleClear = () => {
    schedule.mutate(
      { id: userAddon.id, payload: { scheduledAt: null } },
      {
        onSuccess: () => {
          toast({ title: "Schedule cleared", description: `${addonName} is no longer scheduled.` });
          onOpenChange(false);
        },
        onError: (e: any) => {
          toast({ title: "Failed to clear", description: e?.message ?? "Please try again.", variant: "destructive" });
        },
      }
    );
  };

  const isLoading = schedule.isPending;
  const isValid = Boolean(date && time);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[#00BFFF]/20 bg-[#090909] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-black uppercase tracking-tight">
            <CalendarClock className="h-5 w-5 text-[#00BFFF]" />
            Schedule Session
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Pick a date and time for your <strong>{addonName}</strong> session.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Addon summary pill */}
          <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#00BFFF]/10">
              <Clock className="h-4 w-4 text-[#00BFFF]" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-white">{addonName}</p>
              {duration ? (
                <p className="text-xs text-gray-500">{duration} min session</p>
              ) : (
                <p className="text-xs text-gray-500">Session duration not specified</p>
              )}
            </div>
            {existing && (
              <Badge variant="outline" className="ml-auto shrink-0 border-[#00BFFF]/20 bg-[#00BFFF]/10 text-xs text-[#00BFFF]">
                Scheduled
              </Badge>
            )}
          </div>

          {/* Current schedule (if any) */}
          {existing && (
            <div className="flex items-center gap-2 rounded-lg border border-[#39FF14]/20 bg-[#39FF14]/10 px-3 py-2 text-sm text-[#39FF14]">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Currently: {formatScheduled(existing)}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 flex flex-col">
              <Label className="text-xs font-bold text-gray-400">Date</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start border-white/10 bg-[#111] text-left font-normal text-white hover:bg-white/5 hover:text-white",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto border-white/10 bg-[#111] p-0 text-white">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      setIsCalendarOpen(false);
                    }}
                    disabled={(date) => {
                      // Disable dates in the past (before today)
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5 flex flex-col">
              <Label className="text-xs font-bold text-gray-400">Time</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="border-white/10 bg-[#111] text-white">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="custom-scrollbar max-h-56 border-white/10 bg-[#111] text-white">
                  {TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          {existing && (
            <Button
              variant="ghost"
              className="mr-auto text-red-400 hover:bg-red-500/10 hover:text-red-300"
              onClick={handleClear}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              <span className="ml-1.5">Clear</span>
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading} className="border-white/10 bg-transparent text-gray-300 hover:bg-white/5 hover:text-white">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid || isLoading} className="bg-gradient-to-r from-[#00BFFF] to-[#39FF14] font-black text-black hover:opacity-90">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarClock className="mr-2 h-4 w-4" />}
            {existing ? "Update Schedule" : "Confirm Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
