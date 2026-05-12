import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Dumbbell, CheckCircle2, Zap, Package } from "lucide-react";
import { useGymIDFromDomain, useGym, useMembershipPlansByGym } from "@/hooks/useApi";
import { MembershipPlan } from "@/data/types";

export default function PricingPage({ domain }: { domain: string }) {
  const navigate = useNavigate();
  const { data: gymIdObj } = useGymIDFromDomain(domain);
  const gymId = gymIdObj?.id;

  // Gym info (name, whatsapp) — no plan preload needed here
  const { data: gym } = useGym(gymId);

  // Use the dedicated public plans endpoint: filters is_active=true
  // and already preloads PlanAddons.Addon correctly in the backend
  const { data: plansData, isLoading } = useMembershipPlansByGym(gymId);

  // Sort by price ascending
  const activePlans: MembershipPlan[] = (plansData?.memberships ?? []).sort(
    (a, b) => a.price - b.price
  );

  // Mark the middle plan as "Most Popular"
  const popularIndex = Math.floor((activePlans.length - 1) / 2);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <Dumbbell className="h-7 w-7 text-brand" />
            <span className="font-display text-xl font-bold">
              {gym ? gym.name : "GymFlow"}
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/login")}>Join Now</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-sm text-muted-foreground mb-6 bg-card">
          <Zap className="h-3.5 w-3.5 text-brand" />
          Simple, transparent pricing
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Choose Your{" "}
          <span className="text-brand">Perfect Plan</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          No hidden fees. No contracts. Just straightforward membership plans
          designed for your fitness journey.
        </p>
      </section>

      {/* Plans */}
      <section className="container mx-auto px-4 pb-24">
        {isLoading ? (
          // Skeleton loader
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-3">
                  <div className="h-6 bg-muted rounded w-1/2 mx-auto" />
                  <div className="h-4 bg-muted rounded w-1/3 mx-auto" />
                  <div className="h-10 bg-muted rounded w-2/3 mx-auto mt-2" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-4 bg-muted rounded" />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : activePlans.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No plans available yet.</p>
            <p className="text-sm">Check back soon or contact us directly.</p>
          </div>
        ) : (
          <div
            className={`grid gap-8 max-w-5xl mx-auto ${
              activePlans.length === 1
                ? "grid-cols-1 max-w-sm"
                : activePlans.length === 2
                ? "md:grid-cols-2 max-w-2xl"
                : "md:grid-cols-3"
            }`}
          >
            {activePlans.map((plan, idx) => {
              const isPopular = activePlans.length > 1 && idx === popularIndex;
              const planAddons = plan.planAddons ?? [];
              const hasAddons = planAddons.length > 0;

              return (
                <Card
                  key={plan.id}
                  className={`relative flex flex-col transition-all duration-200 ${
                    isPopular
                      ? "border-brand shadow-xl shadow-brand/10 scale-105 z-10"
                      : "shadow-sm hover:shadow-md"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <Badge className="px-4 py-1 bg-brand text-brand-foreground text-xs font-semibold shadow-sm">
                        ⚡ Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-display">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {plan.durationMonths} month
                      {plan.durationMonths !== 1 ? "s" : ""} membership
                    </CardDescription>
                    <div className="mt-5 space-y-1">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold font-display">
                          ₹{plan.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        ≈ ₹
                        {Math.round(plan.price / plan.durationMonths).toLocaleString("en-IN")}
                        /month
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-2">
                    {/* Core access */}
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                      <span>
                        Full gym access for{" "}
                        <strong>
                          {plan.durationMonths} month
                          {plan.durationMonths !== 1 ? "s" : ""}
                        </strong>
                      </span>
                    </div>

                    {/* Included add-ons */}
                    {hasAddons ? (
                      planAddons.map((pa) => (
                        <div key={pa.id} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                          <span>
                            <strong>{pa.frequency}×</strong>{" "}
                            {pa.addon?.name ?? `Add-on #${pa.addonId}`}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 opacity-40" />
                        <span>No add-ons included</span>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-4">
                    <Button
                      id={`pricing-plan-${plan.id}`}
                      className="w-full"
                      variant={isPopular ? "default" : "outline"}
                      onClick={() => navigate("/login")}
                    >
                      Get Started
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer note */}
      <div className="container mx-auto px-4 pb-12 text-center text-sm text-muted-foreground">
        <p>
          Questions?{" "}
          {gym?.whatsapp ? (
            <a
              href={`https://wa.me/${gym.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              Chat with us on WhatsApp
            </a>
          ) : (
            <span>Contact us for more information.</span>
          )}
        </p>
      </div>
    </div>
  );
}
