import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dumbbell, Users, CalendarCheck, CreditCard, BarChart3, Shield,
  Smartphone, ArrowRight, Star, CheckCircle2,
} from "lucide-react";

const features = [
  { icon: Users, title: "Member Management", desc: "Track members, subscriptions, and profiles with ease." },
  { icon: CalendarCheck, title: "Attendance Tracking", desc: "Biometric and manual check-in with real-time logs." },
  { icon: CreditCard, title: "Payment Processing", desc: "Automated billing, invoices, and payment status tracking." },
  { icon: BarChart3, title: "Reports & Analytics", desc: "Revenue, attendance trends, and membership insights." },
  { icon: Shield, title: "Role-Based Access", desc: "Super Admin, Gym Admin, Trainer, and Member portals." },
  { icon: Smartphone, title: "Biometric Integration", desc: "Seamless biometric ID for frictionless gym access." },
];

const testimonials = [
  { name: "David Park", role: "Gym Owner", text: "GymFlow transformed how we manage our 500+ members. The attendance tracking alone saved us hours daily.", rating: 5 },
  { name: "Lisa Chen", role: "Fitness Trainer", text: "Creating workout plans and tracking my clients' progress has never been easier. Love the trainer dashboard!", rating: 5 },
  { name: "Mark Roberts", role: "Multi-Gym Owner", text: "Managing 3 locations from one dashboard is a game-changer. The super admin view gives me everything I need.", rating: 5 },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <Dumbbell className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-bold">GymFlow</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" onClick={() => navigate("/login")}>Sign In</Button>
            <Button onClick={() => navigate("/register")}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 md:py-32 text-center">
        <Badge variant="secondary" className="mb-4 px-4 py-1.5">
          🚀 The #1 Gym Management Platform
        </Badge>
        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
          Manage Your Gym Like a{" "}
          <span className="text-primary">Pro</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          All-in-one SaaS platform for gym owners, trainers, and members. Streamline memberships, track attendance, process payments, and grow your fitness business.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/register")} className="text-base px-8">
            Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/admin")} className="text-base px-8">
            View Demo Dashboard
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">No credit card required · 14-day free trial</p>
      </section>

      {/* Features */}
      <section id="features" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Everything You Need to Run Your Gym</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Powerful features designed for modern fitness businesses.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{f.title}</CardTitle>
                  <CardDescription className="text-base">{f.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Loved by Gym Owners</h2>
            <p className="text-muted-foreground text-lg">Join hundreds of gyms already using GymFlow.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="border shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4">"{t.text}"</p>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Ready to Transform Your Gym?</h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">Start your free trial today and see the difference GymFlow makes.</p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/register")} className="text-base px-8">
            Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            <span className="font-display font-bold">GymFlow</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 GymFlow. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link>
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
