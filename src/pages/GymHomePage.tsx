import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Dumbbell, Users, CalendarCheck, CreditCard, BarChart3,
  ArrowRight, ChevronDown, ChevronUp, MessageCircle,
  Zap, TrendingUp, Clock, UserCheck, LineChart, Building2,
  Fingerprint, MessageSquare, Gift, Share2, Target, Star,
} from "lucide-react";
import { useState } from "react";
import { useGymIDFromDomain, useGym, useGyms } from "@/hooks/useApi";
import heroImg from "@/assets/hero-gym.jpg";

/* ─── Testimonials ─── */
const testimonials = [
  { name: "Rahul Sharma", role: "Gym Owner", text: "Since switching to GymFlow, managing memberships and payments has become effortless. My staff saves hours every day.", rating: 5 },
  { name: "Priya Patel", role: "Fitness Studio Manager", text: "The attendance tracking and WhatsApp reminders have drastically reduced no-shows. Our retention rate improved by 40%.", rating: 5 },
  { name: "Mike Chen", role: "Multi-Location Owner", text: "Managing 3 branches from one dashboard is a game-changer. Reports and staff management across locations is seamless.", rating: 5 },
];

/* ─── Features ─── */
const features = [
  { icon: Users, title: "Member Management", desc: "Complete member profiles, membership tracking, and engagement tools." },
  { icon: CalendarCheck, title: "Attendance Tracking", desc: "Biometric and manual check-in with real-time attendance reports." },
  { icon: CreditCard, title: "Payment & Billing", desc: "Automated invoicing, payment reminders, and revenue tracking." },
  { icon: Fingerprint, title: "Biometric Access", desc: "Secure gym entry with fingerprint and facial recognition support." },
  { icon: MessageSquare, title: "WhatsApp Integration", desc: "Automated reminders, birthday wishes, and member communication." },
  { icon: BarChart3, title: "Reports & Analytics", desc: "Revenue, attendance, and growth insights at your fingertips." },
];

/* ─── Showcases ─── */
const showcases = [
  {
    icon: Fingerprint,
    title: "Biometric Check-In & Access Control",
    desc: "Control gym entry with biometric check-in/check-out and track accurate attendance.",
    bullets: ["Biometric check-in/check-out at entry", "Secure access even without internet", "Accurate attendance reports for members & staff"],
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Integration",
    desc: "Seamless communication with automated messages directly to members via WhatsApp.",
    bullets: ["Automated reminders, updates, and alerts", "Two-way communication for personalized support", "Automated birthday and festival wishes"],
  },
  {
    icon: Target,
    title: "Lead Management",
    desc: "Capture and manage leads in real-time from multiple sources.",
    bullets: ["Track leads through sales funnel", "Personalized communication for better conversion", "Clear insights into lead performance trends"],
  },
];

/* ─── FAQ ─── */
const faqs = [
  { q: "Will this gym management software work for my type of gym?", a: "Yes. The software is designed for single gyms, fitness studios, personal training centers, and multi-location gym chains." },
  { q: "How long does it take to set up?", a: "Most gyms can go live within a few days. Setup includes gym configuration, member import, billing setup, and staff access." },
  { q: "Can I manage multiple branches?", a: "Yes. You can manage multiple gym branches from a single dashboard while keeping branch-wise access, reports, and staff control." },
  { q: "Is this software secure?", a: "Yes. The software uses secure cloud infrastructure with controlled access for owners, managers, trainers, and staff." },
];

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

export default function GymHomePage({ domain }: { domain: string }) {
  const navigate = useNavigate();
  const { data: gymIdObj, isLoading: isIdLoading } = useGymIDFromDomain(domain);
  const { data: gym, isLoading: isGymLoading } = useGym(gymIdObj?.id);

  if (isIdLoading || isGymLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!gym) return null;

  const whatsappUrl = gym.whatsapp ? `https://wa.me/${gym.whatsapp.replace(/[^0-9]/g, "")}` : "#";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/20 bg-background/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <Dumbbell className="h-7 w-7 text-brand" />
            <span className="font-display text-xl font-bold">{gym.name}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={() => navigate("/login")} variant="outline" className="border-brand/30 text-brand hover:bg-brand/10">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
              Welcome to{" "}
              <span className="text-brand">{gym.name}</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-4">{gym.address}</p>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Your complete fitness destination with state-of-the-art equipment, expert trainers, and a community that keeps you motivated.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => navigate("/login")} className="bg-brand text-brand-foreground hover:bg-brand/90 text-base px-8 rounded-full">
                Join Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" onClick={() => navigate("/pricing")} className="bg-brand text-brand-foreground hover:bg-brand/90 text-base px-8 rounded-full">
                Pricing
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-brand/10 border border-border/20">
              <img src={heroImg} alt={`${gym.name} - Fitness Center`} className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">What We Offer</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Everything you need for your fitness journey, managed seamlessly.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="bg-card/50 border-border/20 hover:border-brand/30 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                    <f.icon className="h-6 w-6 text-brand" />
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
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
            <div key={s.title} className="grid lg:grid-cols-2 gap-12 items-center">
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

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">What Our Members Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="bg-card/50 border-border/20">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-brand text-brand" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed italic">"{t.text}"</p>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-card/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="py-12 bg-brand">
        <div className="container mx-auto px-4 text-center pb-4">
          <p className="text-xl font-display font-bold text-brand-foreground mb-3">{gym.name}</p>
          <p className="text-sm text-brand-foreground/80 mb-2 max-w-md mx-auto leading-relaxed">{gym.address}</p>
          {gym.whatsapp && (
             <p className="text-sm font-medium text-brand-foreground/90 mb-1">Phone: {gym.whatsapp}</p>
          )}
        </div>
        <div className="container mx-auto px-4 text-center mt-6 border-t border-brand-foreground/20 pt-8">
          <p className="text-sm text-brand-foreground/60">© {new Date().getFullYear()} {gym.name}. All rights reserved.</p>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}
