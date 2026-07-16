import { User } from "@/data/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

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
          <div className="max-h-[70vh] space-y-3 overflow-y-auto pt-4 text-sm [&>div]:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] [&>div>span]:min-w-0 [&>div>span]:break-words">
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,2fr)] border-b pb-2">
              <span className="text-muted-foreground text-right mr-4">Name:</span> 
              <span className="min-w-0 break-words font-medium">{user.name}</span>
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
                <span className="col-span-2">{formatDate(user.dob)}</span>
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
            {user.timings && (
              <div className="grid grid-cols-3 border-b pb-2">
                <span className="text-muted-foreground text-right mr-4">Timings:</span>
                <span className="col-span-2">{user.timings}</span>
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
              <div className="grid grid-cols-3 border-b pb-2">
                <span className="text-muted-foreground text-right mr-4">Medical Cond.:</span> 
                <span className="col-span-2">{user.medicalConditions}</span>
              </div>
            )}
            {user.socialMedia && user.socialMedia.length > 0 && user.socialMedia.some(s => s.trim() !== "") && (
              <div className="grid grid-cols-3 pb-2">
                <span className="text-muted-foreground text-right mr-4">Social Media:</span> 
                <span className="col-span-2 space-y-1">
                  {user.socialMedia.map((url, i) => url.trim() ? (
                    <a key={i} href={url} target="_blank" rel="noreferrer" className="block text-primary hover:underline truncate">
                      {url}
                    </a>
                  ) : null)}
                </span>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
