import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Fingerprint, Snowflake, RefreshCw, Ban } from "lucide-react";
import { useUsers, useSubscriptions, useMembershipPlans } from "@/hooks/useApi";
import { formatDate, formatTime } from "@/lib/utils";

export default function MemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const users = useUsers().data?.users || [];
  const subscriptions = useSubscriptions().data?.subscriptions || [];
  const plans = useMembershipPlans().data?.memberships || [];

  const member = users.find((u) => u.id === Number(id));

  // Local fake data for endpoints not currently in the backend
  const memberPayments = [{ id: 1, amount: 49.99, paymentDate: "2023-11-01", status: "Paid" }];
  const attendance = [{ id: 1, date: new Date().toISOString().split("T")[0], timeIn: new Date().toISOString(), timeOut: new Date().toISOString(), source: "Biometric" }];
  const workouts = [{ id: 1, title: "Hypertrophy Program", description: "Standard 4-day split." }];

  const statusBadge = (status: string) => {
    const cls: Record<string, string> = { Active: "bg-success/10 text-success", Expired: "bg-destructive/10 text-destructive", Frozen: "bg-warning/10 text-warning", Paid: "bg-success/10 text-success", Pending: "bg-warning/10 text-warning", Failed: "bg-destructive/10 text-destructive" };
    return <Badge variant="outline" className={cls[status] || ""}>{status}</Badge>;
  };

  if (!member) return <div>Member not found</div>;

  const sub = subscriptions.find((s) => s.userId === member.id && s.status === "Active");
  const plan = sub ? plans.find((p) => p.id === sub.planId) : null;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate("/admin/members")} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Members
      </Button>

      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-display">
            {member.name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-3xl font-bold font-display">{member.name}</h1>
          <p className="text-muted-foreground">{member.email} · {member.phone}</p>
          <div className="flex gap-2 mt-2">
            {sub && statusBadge(sub.status)}
            {member.biometricId ? <Badge variant="secondary"><Fingerprint className="h-3 w-3 mr-1" /> Enrolled</Badge> : <Badge variant="outline">No Biometric</Badge>}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm"><RefreshCw className="h-4 w-4 mr-1" /> Renew</Button>
          <Button size="sm" variant="outline"><Snowflake className="h-4 w-4 mr-1" /> Freeze</Button>
          <Button size="sm" variant="outline"><Fingerprint className="h-4 w-4 mr-1" /> Biometric</Button>
          <Button size="sm" variant="destructive"><Ban className="h-4 w-4 mr-1" /> Deactivate</Button>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent className="pt-6 grid grid-cols-2 gap-4">
              {[
                ["Name", member.name], ["Email", member.email], ["Phone", member.phone],
                ["Date of Birth", member.dob], ["Gender", member.gender],
                ["Biometric ID", member.biometricId || "Not enrolled"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="font-medium">{value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time In</TableHead>
                    <TableHead>Time Out</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.slice(-20).reverse().map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{formatDate(a.date)}</TableCell>
                      <TableCell>{formatTime(a.timeIn)}</TableCell>
                      <TableCell>{a.timeOut ? formatTime(a.timeOut) : "—"}</TableCell>
                      <TableCell><Badge variant={a.source === "Biometric" ? "default" : "secondary"}>{a.source}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="membership">
          <Card>
            <CardContent className="pt-6">
              {sub && plan ? (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["Plan", plan.name], ["Price", `$${plan.price}`], ["Duration", `${plan.durationMonths} month(s)`],
                    ["Start Date", formatDate(sub.startDate)], ["End Date", formatDate(sub.endDate)], ["Status", sub.status],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No active membership found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberPayments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{formatDate(p.paymentDate)}</TableCell>
                      <TableCell>${p.amount.toFixed(2)}</TableCell>
                      <TableCell>{statusBadge(p.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workouts">
          <Card>
            <CardContent className="pt-6">
              {workouts.length > 0 ? (
                <div className="space-y-4">
                  {workouts.map((w) => (
                    <div key={w.id} className="p-4 border rounded-lg">
                      <h3 className="font-semibold">{w.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{w.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No workout plans assigned.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
