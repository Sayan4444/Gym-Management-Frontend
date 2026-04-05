import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGym, useMe } from "@/hooks/useApi";
import { useUpdateGym } from "@/hooks/apis/useGym";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const adminGymId = useMe().data?.gymId;
  const gym = useGym(adminGymId).data;
  const updateGym = useUpdateGym();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    slug: "",
    whatsapp: "",
  });

  useEffect(() => {
    if (gym) {
      setFormData({
        name: gym.name || "",
        address: gym.address || "",
        email: gym.email || "",
        phone: gym.phone || "",
        slug: gym.slug || "",
        whatsapp: gym.whatsapp || "",
      });
    }
  }, [gym]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateGymChanges = () => {
    if (adminGymId) {
      updateGym.mutate(
        {
          identifier: adminGymId,
          data: formData,
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Gym settings updated successfully.",
            });
          },
          onError: (err: unknown) => {
            const message = err instanceof Error ? err.message : "Failed to update gym settings.";
            toast({
              variant: "destructive",
              title: "Error",
              description: message,
            });
          },
        }
      );
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold font-display">Settings</h1>
        <p className="text-muted-foreground">Manage your gym profile</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gym Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Gym Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input name="address" value={formData.address} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Contact Email</Label>
            <Input name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp</Label>
            <Input name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input name="slug" value={formData.slug} onChange={handleChange} />
          </div>
          <Separator />
          <Button onClick={updateGymChanges} disabled={updateGym.isPending}>
            {updateGym.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
