import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Award,
  Camera,
  Clock,
  Dumbbell,
  Landmark,
  Loader2,
  Save,
  Settings,
  Trash2,
} from "lucide-react";

import { useGym, useMe } from "@/hooks/useApi";
import { UpdateGymPayload, useUpdateGym } from "@/hooks/apis/useGym";
import { useToast } from "@/hooks/use-toast";

type SettingsPanel = "general" | "gym";

const panelItems: Array<{ id: SettingsPanel; label: string; icon: typeof Settings }> = [
  { id: "general", label: "General Setup", icon: Settings },
  { id: "gym", label: "Gym Information", icon: Landmark },
];

const inputClass =
  "w-full rounded-lg border border-white/10 bg-[#111] p-2.5 text-xs text-white placeholder:text-gray-600 focus:border-[#00BFFF]/60 focus:outline-none";

const labelClass = "font-sans text-xs font-bold text-gray-400";

export default function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const panelParam = searchParams.get("panel") as SettingsPanel | null;
  const activePanel: SettingsPanel = panelParam && panelItems.some((item) => item.id === panelParam) ? panelParam : "general";

  const adminGymId = useMe().data?.gymId;
  const gym = useGym(adminGymId).data;
  const updateGym = useUpdateGym();
  const { toast } = useToast();

  const [generalSettings, setGeneralSettings] = useState({
    openingTime: "",
    closingTime: "",
    renewalNoticeDays: 30,
  });

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
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    if (!gym) return;

    setGeneralSettings({
      openingTime: gym.openingTime || "",
      closingTime: gym.closingTime || "",
      renewalNoticeDays: gym.renewalNoticeDays || 30,
    });
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
  }, [gym]);

  const changePanel = (panel: SettingsPanel) => {
    setSearchParams(panel === "general" ? { tab: "settings" } : { tab: "settings", panel });
  };

  const handleGymFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;

    const file = event.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveImage(false);
  };

  const handleDeleteImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const handleGeneralSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!adminGymId) {
      toast({ title: "Gym not found for this admin", variant: "destructive" });
      return;
    }

    updateGym.mutate(
      {
        id: adminGymId,
        data: {
          openingTime: generalSettings.openingTime,
          closingTime: generalSettings.closingTime,
          renewalNoticeDays: generalSettings.renewalNoticeDays,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Settings updated", description: "Operational timings and renewal window have been saved." });
        },
        onError: (error: unknown) => {
          const message = error instanceof Error ? error.message : "Failed to update settings.";
          toast({ title: "Error", description: message, variant: "destructive" });
        },
      },
    );
  };

  const handleGymSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!adminGymId) {
      toast({ title: "Gym not found for this admin", variant: "destructive" });
      return;
    }

    let payload: UpdateGymPayload | FormData;
    if (imageFile || removeImage) {
      const data = new FormData();
      if (imageFile) data.append("gym_icon", imageFile);
      if (removeImage) data.append("remove_image", "true");
      data.append("name", formData.name);
      data.append("address", formData.address);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("slug", formData.slug);
      data.append("whatsapp", formData.whatsapp);
      data.append("instagram", formData.instagram);
      data.append("facebook", formData.facebook);
      data.append("youtube", formData.youtube);
      data.append("google_maps_link", formData.googleMapsLink);
      payload = data;
    } else {
      payload = { ...formData, remove_image: removeImage };
    }

    updateGym.mutate(
      { id: adminGymId, data: payload },
      {
        onSuccess: () => {
          toast({ title: "Gym settings updated", description: "Your backend gym profile has been saved." });
        },
        onError: (error: unknown) => {
          const message = error instanceof Error ? error.message : "Failed to update gym settings.";
          toast({ title: "Error", description: message, variant: "destructive" });
        },
      },
    );
  };

  return (
    <div className="space-y-6" id="settings-workbench">
      <div className="glass-card rounded-2xl border border-white/5 bg-gradient-to-tr from-[#111] to-[#00BFFF]/5 p-5">
        <h3 className="text-base font-bold tracking-tight text-white">Settings</h3>
      </div>

      <div className="glass-card overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0a] shadow-2xl">
        <div className="border-b border-white/5 bg-[#090909] p-3">
          <div className="flex w-full flex-col gap-2 rounded-xl bg-white/[0.02] p-1 sm:inline-flex sm:w-auto sm:flex-row">
            {panelItems.map((item) => {
              const Icon = item.icon;
              const active = activePanel === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => changePanel(item.id)}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
                    active ? "bg-[#00BFFF] text-black shadow-[0_0_18px_rgba(0,191,255,0.24)]" : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {activePanel === "general" && (
                <form onSubmit={handleGeneralSubmit} className="space-y-4 font-sans text-xs">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">General Operational Timings</h4>
                    <Clock className="h-4 w-4 text-[#00BFFF]" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className={labelClass}>Daily Opening Timings</label>
                      <input
                        type="text"
                        value={generalSettings.openingTime}
                        placeholder="05:00 AM"
                        onChange={(event) => setGeneralSettings({ ...generalSettings, openingTime: event.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Daily Closing Timings</label>
                      <input
                        type="text"
                        value={generalSettings.closingTime}
                        placeholder="10:00 PM"
                        onChange={(event) => setGeneralSettings({ ...generalSettings, closingTime: event.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className={labelClass}>Renewals alert threshold range (Days)</label>
                      <input
                        type="number"
                        value={generalSettings.renewalNoticeDays}
                        onChange={(event) => setGeneralSettings({ ...generalSettings, renewalNoticeDays: Number(event.target.value) })}
                        className={`${inputClass} font-mono`}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end border-t border-white/5 pt-4">
                    <button
                      type="submit"
                      disabled={updateGym.isPending}
                      className="flex items-center gap-1.5 rounded-xl bg-[#00BFFF] px-5 py-2.5 font-black text-black disabled:opacity-50"
                    >
                      {updateGym.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      <span>{updateGym.isPending ? "Saving..." : "Save Settings"}</span>
                    </button>
                  </div>
                </form>
              )}

              {activePanel === "gym" && (
                <form onSubmit={handleGymSubmit} className="space-y-5 font-sans text-xs">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Registered Gym Corporate Address Details</h4>
                    <Award className="h-4 w-4 text-[#39FF14]" />
                  </div>

                  <div className="flex flex-col gap-4 rounded-xl border border-white/5 bg-white/[0.01] p-4 sm:flex-row sm:items-center">
                    <div className="relative h-24 w-24 shrink-0">
                      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Gym Logo Preview" className="h-full w-full object-cover" />
                        ) : (
                          <Dumbbell className="h-10 w-10 text-[#00BFFF]/60" />
                        )}
                      </div>
                      <label
                        htmlFor="gym-logo-upload"
                        className="absolute -right-2 bottom-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#00BFFF] text-black shadow-md transition-transform hover:scale-105"
                      >
                        <Camera className="h-4 w-4" />
                      </label>
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={handleDeleteImage}
                          className="absolute -left-2 bottom-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-transform hover:scale-105"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      <input id="gym-logo-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#39FF14]">Brand Identity</p>
                      <h5 className="mt-1 text-sm font-bold text-white">Gym Logo & Public Profile</h5>
                      <p className="mt-1 max-w-xl text-xs leading-relaxed text-gray-500">
                        Logo and gym details are saved to the backend gym profile used across the dashboard shell.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className={labelClass}>Gym Brand Legal Name</label>
                      <input name="name" value={formData.name} onChange={handleGymFieldChange} className={inputClass} />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Customer support phone</label>
                      <input name="phone" value={formData.phone} onChange={handleGymFieldChange} className={`${inputClass} font-mono`} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClass}>Post/Mail registered corporation Address</label>
                    <input name="address" value={formData.address} onChange={handleGymFieldChange} className={inputClass} />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className={labelClass}>Support Email credentials</label>
                      <input name="email" type="email" value={formData.email} onChange={handleGymFieldChange} className={`${inputClass} font-mono`} />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Gym URL Slug</label>
                      <input name="slug" value={formData.slug} onChange={handleGymFieldChange} className={`${inputClass} font-mono`} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className={labelClass}>WhatsApp Contact</label>
                      <input name="whatsapp" value={formData.whatsapp} onChange={handleGymFieldChange} className={`${inputClass} font-mono`} />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Google Maps Link</label>
                      <input name="googleMapsLink" value={formData.googleMapsLink} onChange={handleGymFieldChange} className={inputClass} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <label className={labelClass}>Instagram</label>
                      <input name="instagram" value={formData.instagram} onChange={handleGymFieldChange} className={inputClass} />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Facebook</label>
                      <input name="facebook" value={formData.facebook} onChange={handleGymFieldChange} className={inputClass} />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>YouTube</label>
                      <input name="youtube" value={formData.youtube} onChange={handleGymFieldChange} className={inputClass} />
                    </div>
                  </div>

                  <div className="flex justify-end border-t border-white/5 pt-4">
                    <button
                      type="submit"
                      disabled={updateGym.isPending}
                      className="flex items-center gap-1.5 rounded-xl bg-[#00BFFF] px-5 py-2.5 font-black text-black disabled:opacity-50"
                    >
                      {updateGym.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      <span>{updateGym.isPending ? "Updating..." : "Update Corp Profile"}</span>
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
