import { User } from "@/data/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface UserDetailsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsDialog({ user, open, onOpenChange }: UserDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        {user && (
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pt-4 text-sm">
            <div className="grid grid-cols-3 border-b pb-2">
              <span className="text-muted-foreground text-right mr-4">Name:</span> 
              <span className="col-span-2 font-medium">{user.name}</span>
            </div>
            <div className="grid grid-cols-3 border-b pb-2">
              <span className="text-muted-foreground text-right mr-4">Email:</span> 
              <span className="col-span-2">{user.email}</span>
            </div>
            <div className="grid grid-cols-3 border-b pb-2">
              <span className="text-muted-foreground text-right mr-4">Phone:</span> 
              <span className="col-span-2">{user.phone}</span>
            </div>
            {user.dob && (
              <div className="grid grid-cols-3 border-b pb-2">
                <span className="text-muted-foreground text-right mr-4">DOB:</span> 
                <span className="col-span-2">{new Date(user.dob).toLocaleDateString()}</span>
              </div>
            )}
            {user.gender && (
              <div className="grid grid-cols-3 border-b pb-2">
                <span className="text-muted-foreground text-right mr-4">Gender:</span> 
                <span className="col-span-2">{user.gender}</span>
              </div>
            )}
            {user.bloodGroup && (
              <div className="grid grid-cols-3 border-b pb-2">
                <span className="text-muted-foreground text-right mr-4">Blood Group:</span> 
                <span className="col-span-2">{user.bloodGroup}</span>
              </div>
            )}
            {user.address && (
              <div className="grid grid-cols-3 border-b pb-2">
                <span className="text-muted-foreground text-right mr-4">Address:</span> 
                <span className="col-span-2">{user.address}</span>
              </div>
            )}
            {user.emergencyContactName && (
              <div className="grid grid-cols-3 border-b pb-2">
                <span className="text-muted-foreground text-right mr-4">Emergency Contact:</span> 
                <span className="col-span-2">{user.emergencyContactName} ({user.emergencyContactPhone})</span>
              </div>
            )}
            <div className="grid grid-cols-3 border-b pb-2">
              <span className="text-muted-foreground text-right mr-4">Role:</span> 
              <span className="col-span-2 capitalize">{user.role}</span>
            </div>
            {user.height && (
              <div className="grid grid-cols-3 border-b pb-2">
                <span className="text-muted-foreground text-right mr-4">Height:</span> 
                <span className="col-span-2">{user.height} cm</span>
              </div>
            )}
            {user.weight && (
              <div className="grid grid-cols-3 border-b pb-2">
                <span className="text-muted-foreground text-right mr-4">Weight:</span> 
                <span className="col-span-2">{user.weight} kg</span>
              </div>
            )}
            {user.medicalConditions && (
              <div className="grid grid-cols-3 pb-2">
                <span className="text-muted-foreground text-right mr-4">Medical Cond.:</span> 
                <span className="col-span-2">{user.medicalConditions}</span>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
