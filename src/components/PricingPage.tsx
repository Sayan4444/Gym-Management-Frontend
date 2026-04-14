import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Dumbbell, CheckCircle2 } from "lucide-react";
import { useGym } from "@/hooks/useApi";


export default function PricingPage({ domain }: { domain: string }) {
  const navigate = useNavigate();
  const { data: gym } = useGym(domain,"membership_plans");
  const plans = gym?.membershipPlans;
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <Dumbbell className="h-7 w-7 text-brand" />
            <span className="font-display text-xl font-bold">{gym ? gym.name : "GymFlow"}</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" onClick={() => navigate("/login")}>Sign In</Button>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">Choose the plan that fits your gym. All plans include a 14-day free trial.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans?.map((plan) => (
            <Card key={plan.id} className={`relative flex flex-col ${plan.isActive ? "border-brand shadow-lg scale-105" : "shadow-sm"}`}>
              {plan.isActive && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 bg-brand text-brand-foreground">Active</Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.durationMonths} month{plan.durationMonths !== 1 ? "s" : ""}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold font-display">₹{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />
                    {plan.durationMonths} month{plan.durationMonths !== 1 ? "s" : ""} access
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-brand shrink-0" />
                    Full gym access
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.isActive ? "default" : "outline"} onClick={() => navigate("/login")}>
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
