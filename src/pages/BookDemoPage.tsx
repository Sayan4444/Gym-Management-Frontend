import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Dumbbell, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useBookDemo } from "../hooks/apis/useBookDemo";

export default function BookDemoPage() {
  const navigate = useNavigate();
  const { gymName } = useParams();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const bookDemo =useBookDemo();
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.mobile) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      bookDemo.mutateAsync(form)
      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/20 bg-background/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to={gymName ? `/${gymName}` : "/"} className="flex items-center gap-2">
            <Dumbbell className="h-7 w-7 text-brand" />
            <span className="font-display text-xl font-bold">GymFlow</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" onClick={() => navigate(gymName ? `/${gymName}` : "/")} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16 md:py-24 max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Book Your <span className="text-brand">Free Demo</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            See how GymFlow can transform your fitness business. Get a personalized demo from our experts.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-16 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-brand mx-auto" />
            <h2 className="font-display text-2xl font-bold">Thank You!</h2>
            <p className="text-muted-foreground">Your demo request has been submitted successfully.</p>
            <p className="text-muted-foreground">Our team will get in touch with you within 24 hours!</p>
            <Button onClick={() => navigate(gymName ? `/${gymName}` : "/")} className="mt-6 bg-brand text-brand-foreground hover:bg-brand/90">
              Back to Home
            </Button>
          </div>
        ) : (
          <div className="bg-card border border-border/30 rounded-2xl p-6 md:p-10 shadow-lg">


            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="mobile">Mobile Number <span className="text-destructive">*</span></Label>
                <Input
                  id="mobile"
                  placeholder="Enter mobile number"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address <span className="text-muted-foreground text-xs">(Optional)</span></Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferredDate">Preferred Date <span className="text-muted-foreground text-xs">(Optional)</span></Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={form.preferredDate}
                    onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="preferredTime">Preferred Time <span className="text-muted-foreground text-xs">(Optional)</span></Label>
                  <Input
                    id="preferredTime"
                    type="time"
                    value={form.preferredTime}
                    onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Tell us about your requirements (optional)"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="mt-1.5 min-h-[100px]"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-brand text-brand-foreground hover:bg-brand/90 text-base rounded-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit Demo Request"
                )}
              </Button>
            </form>
          </div>
        )}
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
