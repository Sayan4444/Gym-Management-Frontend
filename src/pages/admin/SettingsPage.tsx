import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGym, useMe } from "@/hooks/useApi";
import { useUpdateGym } from "@/hooks/apis/useGym";
import { useToast } from "@/hooks/use-toast";
import { Camera, Trash2, Dumbbell, Loader2 } from "lucide-react";

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
    instagram: "",
    facebook: "",
    youtube: "",
    googleMapsLink: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState<boolean>(false);

  useEffect(() => {
    if (gym) {
      setFormData({
        name: gym.name || "",
        address: gym.address || "",
        email: gym.email || "",
        phone: gym.phone || "",
        slug: gym.slug || "",
        whatsapp: gym.whatsapp || "",
        instagram: gym.instagram || "",
        facebook: gym.facebook || "",
        youtube: gym.youtube || "",
        googleMapsLink: gym.googleMapsLink || "",
      });
      setImageFile(null);
      setImagePreview(gym.gymIcon || null);
      setRemoveImage(false);
    }
  }, [gym]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  const handleDeleteImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateGymChanges = () => {
    if (adminGymId) {
      let payload: any;
      if (imageFile || removeImage) {
        const fd = new FormData();
        if (imageFile) fd.append("gym_icon", imageFile);
        if (removeImage) fd.append("remove_image", "true");
        fd.append("name", formData.name);
        fd.append("address", formData.address);
        fd.append("email", formData.email);
        fd.append("phone", formData.phone);
        fd.append("slug", formData.slug);
        fd.append("whatsapp", formData.whatsapp);
        fd.append("instagram", formData.instagram);
        fd.append("facebook", formData.facebook);
        fd.append("youtube", formData.youtube);
        fd.append("google_maps_link", formData.googleMapsLink);
        payload = fd;
      } else {
        payload = { ...formData, remove_image: removeImage };
      }

      updateGym.mutate(
        {
          id: adminGymId,
          data: payload,
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
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative group">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-primary/10 border-4 border-background shadow-sm flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Gym Logo Preview" className="h-full w-full object-cover" />
                ) : (
                  <Dumbbell className="h-10 w-10 text-primary/50" />
                )}
              </div>
              <Label
                htmlFor="gym-logo-upload"
                className="absolute bottom-0 right-0 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform"
              >
                <Camera className="h-4 w-4" />
              </Label>
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="absolute bottom-0 left-0 h-8 w-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <Input
                id="gym-logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">Gym Logo</h3>
            </div>
          </div>

          <div className="space-y-4">
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
            <Label>Instagram</Label>
            <Input name="instagram" value={formData.instagram} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Facebook</Label>
            <Input name="facebook" value={formData.facebook} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>YouTube</Label>
            <Input name="youtube" value={formData.youtube} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Google Maps Link</Label>
            <Input name="googleMapsLink" value={formData.googleMapsLink} onChange={handleChange} />
          </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input name="slug" value={formData.slug} onChange={handleChange} />
            </div>
          </div>
          <Separator />
          <Button onClick={updateGymChanges} disabled={updateGym.isPending}>
            {updateGym.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {updateGym.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
