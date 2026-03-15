import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dumbbell, Users, CalendarCheck, CreditCard, BarChart3, Shield,
  ArrowRight, ChevronDown, ChevronUp,
  Zap, TrendingUp, Clock, UserCheck, LineChart, Building2,
  Fingerprint, MessageSquare, Gift, Share2, Target,
  MapPin, Phone, User, type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import heroImg from "@/assets/hero-gym.jpg";
import data from "@/data/landingPage.json";

/* ─── Icon Map ─── */
const iconMap: Record<string, LucideIcon> = {
  Zap, TrendingUp, Clock, UserCheck, LineChart, Building2,
  Fingerprint, MessageSquare, Gift, Share2, Target,
  Users, BarChart3,
};

function getIcon(name: string): LucideIcon {
  return iconMap[name] || Dumbbell;
}

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
            <span className="font-display text-xl font-bold">{data.header.brandName}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="/#benefits" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Benefits</a>
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
              {data.hero.title}{" "}
              <span className="text-brand">{data.hero.titleHighlight}</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              {data.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => navigate("/bookslot")} className="bg-brand text-brand-foreground hover:bg-brand/90 text-base px-8 rounded-full">
                Schedule A Demo <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-brand/10 border border-border/20">
              <img src={heroImg} alt={`${data.header.brandName} - Gym Management Software Dashboard`} className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.valueProps.map((v) => {
              const Icon = getIcon(v.iconName);
              return (
                <Card key={v.title} className="bg-card/50 border-border/20 hover:border-brand/30 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-xl bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                      <Icon className="h-6 w-6 text-brand" />
                    </div>
                    <h3 className="font-display text-lg font-bold mb-2">{v.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Showcases */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4 space-y-20">
          {data.showcases.map((s, i) => {
            const Icon = getIcon(s.iconName);
            return (
              <div key={s.title} className={`grid lg:grid-cols-2 gap-12 items-center`}>
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="h-14 w-14 rounded-xl bg-brand/10 flex items-center justify-center mb-4">
                    <Icon className="h-7 w-7 text-brand" />
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
                  <Icon className="h-32 w-32 text-brand/20" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{data.benefits.sectionTitle} <span className="text-brand">{data.benefits.sectionTitleHighlight}</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{data.benefits.sectionSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.benefits.items.map((b) => {
              const Icon = getIcon(b.iconName);
              return (
                <div key={b.title} className="flex gap-4 p-5 rounded-xl border border-border/20 hover:border-brand/20 transition-colors bg-card/30">
                  <div className="h-10 w-10 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{b.title}</h3>
                    <p className="text-sm text-muted-foreground">{b.desc}</p>
                  </div>
                </div>
              );
            })}
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
            {data.faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-foreground mb-4">{data.cta.title}</h2>
          <p className="text-brand-foreground/80 text-lg mb-8 max-w-xl mx-auto">{data.cta.subtitle}</p>
          <Button size="lg" onClick={() => navigate("/bookslot")} className="bg-background text-foreground hover:bg-background/90 text-base px-8 rounded-full">
            Schedule A Demo <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-12 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <Link to="/" className="flex items-center gap-2 mb-3">
                <Dumbbell className="h-6 w-6 text-brand" />
                <span className="font-display text-lg font-bold">{data.header.brandName}</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">{data.hero.subtitle.slice(0, 120)}…</p>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <User className="h-4 w-4 text-brand shrink-0" />
                  <span>{data.footer.contactName}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-brand shrink-0" />
                  <a href={`tel:${data.footer.phone}`} className="hover:text-foreground transition-colors">{data.footer.phone}</a>
                </li>
              </ul>
            </div>

            {/* Location */}
            <div>
              <h4 className="font-semibold mb-4">Our Location</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                  <span>{data.footer.address}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                  <span>{data.footer.location}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/20 mt-8 pt-6 text-center">
            <p className="text-sm text-muted-foreground">{data.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
