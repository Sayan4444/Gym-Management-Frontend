import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGyms } from "@/hooks/useApi";

export default function SettingsPage() {
  const gymId = 1;
  const gyms = useGyms().data?.gyms || [];
  const gym = gyms.find((g) => g.id === gymId) || { name: "Loading...", address: "" };

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
            <Input defaultValue={gym.name} />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input defaultValue={gym.address} />
          </div>
          <div className="space-y-2">
            <Label>Contact Email</Label>
            <Input defaultValue="info@ironforge.com" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input defaultValue="+1-555-0100" />
          </div>
          <Separator />
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
