import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Dumbbell } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { gymName } = useParams();
  const [step, setStep] = useState(1);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <Link to="/" className="flex items-center gap-2 justify-center mb-4">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="font-display text-2xl font-bold">GymFlow</span>
          </Link>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Step {step} of 2</CardDescription>
          <div className="flex gap-2 mt-2">
            <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
          </div>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input type="tel" placeholder="+1-555-0100" />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label>Gym Name</Label>
                  <Input placeholder="My Awesome Gym" />
                </div>
                <div className="space-y-2">
                  <Label>Gym Address</Label>
                  <Input placeholder="123 Main St, City, State" />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select defaultValue="GymAdmin">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GymAdmin">Gym Owner / Admin</SelectItem>
                      <SelectItem value="Trainer">Trainer</SelectItem>
                      <SelectItem value="Member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select defaultValue="Male">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <div className="flex gap-2 w-full">
              {step > 1 && (
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>Back</Button>
              )}
              <Button type="submit" className="flex-1">
                {step < 2 ? "Next" : "Create Account"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Already have an account? <Link to={gymName ? `/${gymName}/login` : "/super-admin/login"} className="text-primary hover:underline">Sign in</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
