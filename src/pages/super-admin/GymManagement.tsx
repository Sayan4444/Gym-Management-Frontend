import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { useGyms, useUsers, usePayments } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Gym } from "../../data/types";

function GymCard({ gym }: { gym: Gym }) {
  const users = useUsers({ gymId: gym.id, include: "subscription" }).data?.users || [];
  const payments = usePayments({ gym_id: gym.id, status: "Paid" }).data?.payments || [];
  
  const members = users.filter((u) => u.role === "Member").length;
  const trainers = users.filter((u) => u.role === "Trainer").length;
  const activeSubs = users.filter((u) => u.subscription?.some(s => s.status === "Active" || s.status === "")).length;
  const revenue = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
              {gym.gymIcon ? (
                <img src={gym.gymIcon} alt={gym.name} className="h-full w-full object-cover" />
              ) : (
                <Building2 className="h-6 w-6 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{gym.name}</h3>
              <p className="text-sm text-muted-foreground">{gym.address}</p>
            </div>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-xl font-bold font-display">{members}</p>
              <p className="text-xs text-muted-foreground">Members</p>
            </div>
            <div>
              <p className="text-xl font-bold font-display">{trainers}</p>
              <p className="text-xs text-muted-foreground">Trainers</p>
            </div>
            <div>
              <p className="text-xl font-bold font-display">{activeSubs}</p>
              <p className="text-xs text-muted-foreground">Active Subs</p>
            </div>
            <div>
              <p className="text-xl font-bold font-display text-success">
                ₹{revenue.toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground">Revenue</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function GymManagement() {
  const { data, isLoading } = useGyms();
  const gyms = data?.gyms || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Gym Management</h1>
        <p className="text-muted-foreground">{gyms?.length || 0} gyms registered</p>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          gyms?.map((g) => <GymCard key={g.id} gym={g} />)
        )}
      </div>
    </div>
  );
}
