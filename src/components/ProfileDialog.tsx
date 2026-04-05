import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/data/types";
import { useUpdateProfile } from "@/hooks/useApi";
import {
  User as UserIcon, Mail, Phone, Calendar, Heart,
  Ruler, Weight, Droplets, MapPin, ShieldAlert, Activity,
} from "lucide-react";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

export function ProfileDialog({ open, onOpenChange, user }: ProfileDialogProps) {
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    bloodGroup: "",
    height: "",
    weight: "",
    medicalConditions: "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob || "",
        gender: user.gender || "",
        address: user.address || "",
        emergencyContactName: user.emergencyContactName || "",
        emergencyContactPhone: user.emergencyContactPhone || "",
        bloodGroup: user.bloodGroup || "",
        height: user.height ? String(user.height) : "",
        weight: user.weight ? String(user.weight) : "",
        medicalConditions: user.medicalConditions || "",
      });
    }
  }, [open, user]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateProfileMutation = useUpdateProfile();

  const handleSave = () => {
    updateProfileMutation.mutate(
      {
        id: user.id,
        data: {
          name: form.name,
          phone: form.phone,
          dob: form.dob,
          gender: form.gender,
          address: form.address,
          emergencyContactName: form.emergencyContactName,
          emergencyContactPhone: form.emergencyContactPhone,
          bloodGroup: form.bloodGroup,
          height: form.height ? parseFloat(form.height) : undefined,
          weight: form.weight ? parseFloat(form.weight) : undefined,
          medicalConditions: form.medicalConditions,
        }
      },
      {
        onSuccess: () => {
          toast({
            title: "Profile updated",
            description: "Your profile has been saved successfully.",
          });
          onOpenChange(false);
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : "Could not update profile";
          toast({
            variant: "destructive",
            title: "Error",
            description: message,
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] max-h-[85vh] p-0 flex flex-col overflow-hidden gap-0 border-border shadow-2xl">
        <div className="p-6 pb-4 border-b relative">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10">
                <UserIcon className="h-5 w-5 text-primary" />
              </div>
              My Profile
            </DialogTitle>
            <DialogDescription>
              View and update your personal information
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-accent/5">
          {/* ── Personal Information ── */}
          <fieldset className="space-y-4">
            <legend className="flex items-center gap-2 text-sm font-semibold text-foreground border-b pb-2 mb-1 w-full">
              <UserIcon className="h-4 w-4 text-primary" />
              Personal Information
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="profile-name" className="flex items-center gap-1.5 text-xs font-medium">
                  <UserIcon className="h-3 w-3 text-muted-foreground" /> Full Name
                </Label>
                <Input
                  id="profile-name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-email" className="flex items-center gap-1.5 text-xs font-medium">
                  <Mail className="h-3 w-3 text-muted-foreground" /> Email
                </Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={form.email}
                  readOnly
                  className="bg-muted/50 cursor-not-allowed opacity-70"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-phone" className="flex items-center gap-1.5 text-xs font-medium">
                  <Phone className="h-3 w-3 text-muted-foreground" /> Phone
                </Label>
                <Input
                  id="profile-phone"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+1-555-0000"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-dob" className="flex items-center gap-1.5 text-xs font-medium">
                  <Calendar className="h-3 w-3 text-muted-foreground" /> Date of Birth
                </Label>
                <Input
                  id="profile-dob"
                  type="date"
                  value={form.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-gender" className="flex items-center gap-1.5 text-xs font-medium">
                  <UserIcon className="h-3 w-3 text-muted-foreground" /> Gender
                </Label>
                <Select value={form.gender} onValueChange={(v) => handleChange("gender", v)}>
                  <SelectTrigger id="profile-gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </fieldset>

          {/* ── Physical Information ── */}
          <fieldset className="space-y-4">
            <legend className="flex items-center gap-2 text-sm font-semibold text-foreground border-b pb-2 mb-1 w-full">
              <Activity className="h-4 w-4 text-primary" />
              Physical Information
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="profile-height" className="flex items-center gap-1.5 text-xs font-medium">
                  <Ruler className="h-3 w-3 text-muted-foreground" /> Height (cm)
                </Label>
                <Input
                  id="profile-height"
                  type="number"
                  value={form.height}
                  onChange={(e) => handleChange("height", e.target.value)}
                  placeholder="170"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-weight" className="flex items-center gap-1.5 text-xs font-medium">
                  <Weight className="h-3 w-3 text-muted-foreground" /> Weight (kg)
                </Label>
                <Input
                  id="profile-weight"
                  type="number"
                  value={form.weight}
                  onChange={(e) => handleChange("weight", e.target.value)}
                  placeholder="70"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-blood" className="flex items-center gap-1.5 text-xs font-medium">
                  <Droplets className="h-3 w-3 text-muted-foreground" /> Blood Group
                </Label>
                <Select value={form.bloodGroup} onValueChange={(v) => handleChange("bloodGroup", v)}>
                  <SelectTrigger id="profile-blood">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroupOptions.map((bg) => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </fieldset>

          {/* ── Emergency Contact ── */}
          <fieldset className="space-y-4">
            <legend className="flex items-center gap-2 text-sm font-semibold text-foreground border-b pb-2 mb-1 w-full">
              <ShieldAlert className="h-4 w-4 text-primary" />
              Emergency Contact
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="profile-ec-name" className="flex items-center gap-1.5 text-xs font-medium">
                  <UserIcon className="h-3 w-3 text-muted-foreground" /> Contact Name
                </Label>
                <Input
                  id="profile-ec-name"
                  value={form.emergencyContactName}
                  onChange={(e) => handleChange("emergencyContactName", e.target.value)}
                  placeholder="Emergency contact name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="profile-ec-phone" className="flex items-center gap-1.5 text-xs font-medium">
                  <Phone className="h-3 w-3 text-muted-foreground" /> Contact Phone
                </Label>
                <Input
                  id="profile-ec-phone"
                  value={form.emergencyContactPhone}
                  onChange={(e) => handleChange("emergencyContactPhone", e.target.value)}
                  placeholder="+1-555-0000"
                />
              </div>
            </div>
          </fieldset>

          {/* ── Medical & Address ── */}
          <fieldset className="space-y-4">
            <legend className="flex items-center gap-2 text-sm font-semibold text-foreground border-b pb-2 mb-1 w-full">
              <Heart className="h-4 w-4 text-primary" />
              Medical &amp; Address
            </legend>

            <div className="space-y-1.5">
              <Label htmlFor="profile-medical" className="flex items-center gap-1.5 text-xs font-medium">
                <Heart className="h-3 w-3 text-muted-foreground" /> Medical Conditions
              </Label>
              <Textarea
                id="profile-medical"
                value={form.medicalConditions}
                onChange={(e) => handleChange("medicalConditions", e.target.value)}
                placeholder="List any medical conditions, allergies, or injuries..."
                rows={2}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="profile-address" className="flex items-center gap-1.5 text-xs font-medium">
                <MapPin className="h-3 w-3 text-muted-foreground" /> Address
              </Label>
              <Textarea
                id="profile-address"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Street address, city, state, zip code"
                rows={2}
              />
            </div>
          </fieldset>
        </div>

        <div className="p-6 pt-4 border-t bg-card">
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
