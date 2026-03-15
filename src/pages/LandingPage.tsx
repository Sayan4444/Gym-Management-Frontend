import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dumbbell, Users, CalendarCheck, CreditCard, BarChart3, Shield,
  ArrowRight, ChevronDown, ChevronUp,
  Zap, TrendingUp, Clock, UserCheck, LineChart, Building2,
  Fingerprint, MessageSquare, Gift, Share2, Target,
} from "lucide-react";
import { useState } from "react";
import heroImg from "@/assets/hero-gym.jpg";

/* ─── Value Props ─── */
const valueProps = [
  { icon: Zap, title: "Everything in One Place", desc: "Manage members, enquiries, follow-ups, payments, attendance, expenses — all from a single dashboard. No spreadsheets, no confusion." },
  { icon: UserCheck, title: "Better Control Over Staff & Trainers", desc: "Assign staff roles, manage attendance & salaries, track PT sessions, set sales targets, and measure performance." },
  { icon: Users, title: "Happier, More Engaged Members", desc: "Members track calories, PRs, steps, and water intake through a branded app with exclusive brand vouchers." },
  { icon: TrendingUp, title: "Ready to Grow With You", desc: "Whether you run one gym or multiple branches, the software scales with your business without breaking workflows." },
  { icon: MessageSquare, title: "Support That Actually Helps", desc: "Smooth onboarding with complete data migration, a dedicated relationship manager, WhatsApp support, and monthly check-ins." },
  { icon: LineChart, title: "Clear View of Your Revenue", desc: "See exactly how much you earn, pending payments, upcoming payments, and which memberships are due for renewal." },
];

/* ─── Feature Showcases ─── */
const showcases = [
  {
    icon: Fingerprint,
    title: "Biometric Check-In & Access Control",
    desc: "Control gym entry with biometric check-in/check-out and track accurate attendance for members and staff across devices.",
    bullets: ["Biometric check-in/check-out at entry", "Secure access even without internet connectivity", "Accurate attendance reports for members & staff"],
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Integration",
    desc: "Seamless communication with automated messages directly to members via WhatsApp.",
    bullets: ["Automated reminders, updates, and alerts", "Two-way communication for personalized support", "Automated birthday and festival wishes"],
  },
  {
    icon: Gift,
    title: "Brand Collaboration & Rewards",
    desc: "Reward members with exclusive brand offers through strategic collaborations.",
    bullets: ["Partner with top fitness and lifestyle brands", "Increase conversions with instant rewards at payment", "Offers shared via email, WhatsApp, and App"],
  },
  {
    icon: Share2,
    title: "Referral Program",
    desc: "Create a structured referral program to encourage members to refer prospects to your gym.",
    bullets: ["Increase retention with transparent rewards", "Strengthen reputation through word-of-mouth", "Reduce marketing costs while generating leads"],
  },
  {
    icon: Target,
    title: "Lead Management",
    desc: "Capture and manage leads in real-time from multiple sources like Instagram, Facebook, and walk-ins.",
    bullets: ["Track leads through sales funnel", "Personalized communication for better conversion", "Clear insights into lead performance trends"],
  },
];

/* ─── Benefits ─── */
const benefits = [
  { icon: Clock, title: "Save Time on Daily Operations", desc: "Automate memberships, billing, attendance, follow-ups, and communication." },
  { icon: Users, title: "Improve Member Experience", desc: "Clear schedules, timely reminders, easy payments, and progress tracking." },
  { icon: TrendingUp, title: "Increase Revenue & Reduce Leakages", desc: "Track renewals, pending payments, and conversions accurately." },
  { icon: UserCheck, title: "Better Control Over Staff", desc: "Monitor attendance, schedules, follow-ups, and performance from one system." },
  { icon: BarChart3, title: "Make Data-Driven Decisions", desc: "Access detailed reports on enquiries, conversions, attendance, and revenue." },
  { icon: Building2, title: "Scale Your Gym with Confidence", desc: "Supports growth for single or multi-location gyms without breaking processes." },
];

/* ─── FAQ ─── */
const faqs = [
  { q: "Will this gym management software work for my type of gym?", a: "Yes. The software is designed for single gyms, fitness studios, personal training centers, and multi-location gym chains. You can configure memberships, billing, and access rules based on how your gym operates." },
  { q: "How long does it take to set up the software for my gym?", a: "Most gyms can go live within a few days. Setup includes gym configuration, member import, billing setup, and staff access. Our onboarding team guides you through the entire process." },
  { q: "Can I manage multiple gym branches under one account?", a: "Yes. You can manage multiple gym branches from a single dashboard while keeping branch-wise access, reports, and staff control." },
  { q: "What happens to my existing member data?", a: "Your existing member data can be securely imported into the system, including member details, memberships, and payment history — ensuring a smooth transition without data loss." },
  { q: "Will this software help reduce membership drop-outs?", a: "Yes. Automated reminders, follow-ups, progress tracking, and clear communication help improve member engagement and reduce drop-outs over time." },
  { q: "Is this gym management software secure?", a: "Yes. The software uses secure cloud infrastructure with controlled access for owners, managers, trainers, and staff to protect business and member data." },
];

/* ─── FAQ Item ─── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/30 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/10 transition-colors">
        <span className="font-medium text-foreground pr-4">{q}</span>
        {open ? <ChevronUp className="h-5 w-5 text-brand shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />}
      </button>
      {open && <div className="px-5 pb-5 text-muted-foreground leading-relaxed">{a}</div>}
    </div>
  );
}

/* ─── Main Page ─── */
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/20 bg-background/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <Dumbbell className="h-7 w-7 text-brand" />
            <span className="font-display text-xl font-bold">GymFlow</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={() => navigate("/bookslot")} className="bg-brand text-brand-foreground hover:bg-brand/90">Book A Demo</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
              Gym Management Software for{" "}
              <span className="text-brand">Fitness Centers, Studios & Chains</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              An all-in-one gym management software to manage memberships, billing, attendance, workouts, staff, and reports from a single dashboard. Built for growing gyms and multi-location fitness businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => navigate("/bookslot")} className="bg-brand text-brand-foreground hover:bg-brand/90 text-base px-8 rounded-full">
                Schedule A Demo <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/admin")} className="text-base px-8 rounded-full border-border/50">
                View Demo Dashboard
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-brand/10 border border-border/20">
              <img src={heroImg} alt="GymFlow - Gym Management Software Dashboard" className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {valueProps.map((v) => (
              <Card key={v.title} className="bg-card/50 border-border/20 hover:border-brand/30 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                    <v.icon className="h-6 w-6 text-brand" />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcases */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4 space-y-20">
          {showcases.map((s, i) => (
            <div key={s.title} className={`grid lg:grid-cols-2 gap-12 items-center`}>
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className="h-14 w-14 rounded-xl bg-brand/10 flex items-center justify-center mb-4">
                  <s.icon className="h-7 w-7 text-brand" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">{s.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{s.desc}</p>
                <ul className="space-y-3">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-brand/20 flex items-center justify-center mt-0.5 shrink-0">
                        <div className="h-2 w-2 rounded-full bg-brand" />
                      </div>
                      <span className="text-sm text-muted-foreground">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`bg-card/50 border border-border/20 rounded-2xl p-8 flex items-center justify-center min-h-[300px] ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                <s.icon className="h-32 w-32 text-brand/20" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Why Gym Owners Choose <span className="text-brand">GymFlow</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Streamline operations, boost revenue, and deliver an exceptional member experience.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="flex gap-4 p-5 rounded-xl border border-border/20 hover:border-brand/20 transition-colors bg-card/30">
                <div className="h-10 w-10 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                  <b.icon className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-foreground mb-4">Ready to Transform Your Gym Management?</h2>
          <p className="text-brand-foreground/80 text-lg mb-8 max-w-xl mx-auto">Join gyms worldwide using GymFlow to streamline operations and boost revenue.</p>
          <Button size="lg" onClick={() => navigate("/bookslot")} className="bg-background text-foreground hover:bg-background/90 text-base px-8 rounded-full">
            Schedule A Demo <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-8 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">© 2026 GymFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
