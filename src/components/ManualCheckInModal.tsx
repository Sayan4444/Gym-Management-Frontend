import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useMarkManualAttendance } from "@/hooks/apis/useAttendance";
import { useUsers } from "@/hooks/apis/useUser";

interface ManualCheckInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManualCheckInModal({ open, onOpenChange }: ManualCheckInModalProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const { data: usersData } = useUsers();
  const users = usersData?.users || [];
  const markAttendanceMutation = useMarkManualAttendance();

  const handleCheckIn = () => {
    if (!selectedUserId) return;
    markAttendanceMutation.mutate(
      { userId: Number(selectedUserId) },
      {
        onSuccess: () => {
          onOpenChange(false);
          setSelectedUserId("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manual Check-in</DialogTitle>
          <DialogDescription>
            Select a member or trainer to manually log their attendance for today.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCheckIn}
            disabled={!selectedUserId || markAttendanceMutation.isPending}
          >
            {markAttendanceMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Check In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
