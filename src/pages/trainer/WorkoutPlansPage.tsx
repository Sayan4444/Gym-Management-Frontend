import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useUsers } from "@/hooks/useApi";

export default function WorkoutPlansPage() {
  const gymId = 1;
  const users = useUsers(gymId).data?.users || [];
  
  const workouts = [
    { id: 1, title: "Hypertrophy Program", description: "Standard 4-day split.", memberId: 7 }
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Workout Plans</h1>
          <p className="text-muted-foreground">{workouts.length} plans created</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Create Plan</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {workouts.map((w) => {
          const member = users.find((u) => u.id === w.memberId);
          return (
            <Card key={w.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{w.title}</CardTitle>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{w.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Assigned to:</span>
                  <span className="font-medium">{member?.name || "Unknown"}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
