import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { getPlansByGym } from "@/data/dummy";
import { Plus, Pencil, Trash2 } from "lucide-react";

const plans = getPlansByGym(1);

export default function MembershipPlansPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Membership Plans</h1>
          <p className="text-muted-foreground">{plans.length} plans configured</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Add Plan</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Active</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>${p.price.toFixed(2)}</TableCell>
                  <TableCell>{p.durationMonths} month{p.durationMonths > 1 ? "s" : ""}</TableCell>
                  <TableCell>
                    <Badge variant={p.isActive ? "default" : "outline"} className={p.isActive ? "bg-success/10 text-success border-success/20" : ""}>
                      {p.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell><Switch checked={p.isActive} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Ons Section */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display">Add Ons</h2>
          <p className="text-muted-foreground">Optional extras members can add to their plans</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Add Add-On</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Add-On Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Active</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Oxygen Tube1</TableCell>
                <TableCell>$15.00</TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-success/10 text-success border-success/20">Active</Badge>
                </TableCell>
                <TableCell><Switch checked={true} /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Oxygen Tube2</TableCell>
                <TableCell>$20.00</TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-success/10 text-success border-success/20">Active</Badge>
                </TableCell>
                <TableCell><Switch checked={true} /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
