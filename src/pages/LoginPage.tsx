import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Crown, Dumbbell, ShieldCheck, Sparkles, UserCog, Users } from "lucide-react";
import { useGoogleLogin, TokenResponse } from '@react-oauth/google';
import { toast } from "sonner";
import { useGoogleLogin as useGoogleLoginMutation } from "@/hooks/apis/useAuth";
import { useGymIDFromDomain, useGym } from "../hooks/useApi";
import { API_BASE_URL } from "@/lib/api/core";

const devLoginOptions = [
  { role: "SuperAdmin", label: "Super Admin", icon: Crown },
  { role: "GymAdmin", label: "Gym Admin", icon: ShieldCheck },
  { role: "Trainer", label: "Trainer", icon: Dumbbell },
  { role: "Member", label: "Member", icon: Users },
];

export default function LoginPage({ domain }: { domain: string }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showDevLogin = import.meta.env.DEV;
  
  const googleLoginMutation = useGoogleLoginMutation();
  const { data: gymIdObj } = useGymIDFromDomain(domain);
  const { data: gym } = useGym(gymIdObj?.id);

  const handleGoogleSuccess = (tokenResponse: TokenResponse) => {
    googleLoginMutation.mutate({ access_token: tokenResponse.access_token, gym_id: gymIdObj?.id }, {
      onSuccess: (data) => {
        // Token is now set as an HTTP-only cookie by the backend.
        // We rely on the `useMe` hook to fetch user metadata, no localStorage needed.

        toast.success("Successfully logged in!");

        // Route based on role
        const role = data.user.role;

        const pendingToken = searchParams.get("token");
        if (pendingToken) {
          navigate(`/mark-attendance?token=${pendingToken}`);
          return;
        }

        if (role === 'SuperAdmin') {
          navigate('/super-admin');
        } else if (role === 'GymAdmin') {
          navigate(`/admin`);
        } else if (role === 'Trainer') {
          navigate(`/trainer`);
        } else {
          navigate(`/member`);
        }
      },
      onError: (error) => {
        console.error("Login error:", error);
        toast.error("Failed to login with Google");
      }
    });
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => {
      console.error("Google Login Failed");
      toast.error("Failed to login with Google");
    },
  });

  const handleDevLogin = (role: string) => {
    window.location.assign(`${API_BASE_URL}/dev/login?role=${role}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white selection:bg-neon-green/30">
      <div className="absolute inset-0">
        <img
          src="https://picsum.photos/seed/aggressive_gym_workout/1920/1080?blur=1"
          alt=""
          className="h-full w-full scale-105 object-cover object-center opacity-35 saturate-50 brightness-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/55 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,210,255,0.16),transparent_38%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(57,255,20,0.16),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <header className="relative z-10 mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="rounded-lg bg-gradient-to-br from-electric-blue to-neon-green p-2 text-black transition-transform duration-300 group-hover:scale-105">
            {gym?.gymIcon ? (
              <img src={gym.gymIcon} alt={gym.name} className="h-5 w-5 rounded object-cover" />
            ) : (
              <Dumbbell className="h-5 w-5 text-black" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-black uppercase leading-none tracking-tight text-white md:text-xl">
              TRANSFORM <span className="text-neon-green">360</span>
            </span>
            <span className="-mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              GYM Plus
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="whitespace-nowrap rounded-lg border border-white/10 bg-neutral-900/70 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-neutral-200 transition-colors hover:border-neon-green/40 hover:text-neon-green"
        >
          Back Home
        </Link>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center gap-10 px-4 pb-12 pt-6 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
        <section className="text-center lg:col-span-7 lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-neon-green">
            <span className="h-2 w-2 rounded-full bg-neon-green shadow-[0_0_18px_rgba(57,255,20,0.8)]" />
            Member Access Portal
          </div>
          <h1 className="font-display text-4xl font-extrabold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl xl:text-7xl">
            Step Into Your
            <span className="block bg-gradient-to-r from-neon-green via-electric-blue to-white bg-clip-text text-transparent">
              Training Zone.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-neutral-300 sm:text-lg lg:mx-0">
            Sign in to manage attendance, memberships, workouts, payments, and every session that moves you forward.
          </p>

          <div className="mt-10 hidden grid-cols-1 gap-4 border-t border-white/10 pt-8 sm:grid sm:grid-cols-3">
            {[
              { icon: CalendarCheck, label: "Track Attendance" },
              { icon: Users, label: "Member Dashboard" },
              { icon: ShieldCheck, label: "Secure Sign In" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-center gap-3 rounded-xl border border-white/5 bg-neutral-900/60 p-4 text-left sm:justify-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neon-green/10 text-neon-green">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wide text-neutral-300">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="lg:col-span-5">
          <div className="glass-card relative mx-auto w-full max-w-md overflow-hidden rounded-2xl p-6 shadow-2xl sm:p-8">
            <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-neon-green/10 blur-xl" />
            <div className="relative">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-neon-green">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-black uppercase tracking-wide text-white">
                    Welcome Back
                  </h2>
                  <p className="text-sm text-neutral-400">
                    Continue with your Google account.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => login()}
                disabled={googleLoginMutation.isPending}
                className="h-14 w-full gap-3 rounded-xl border border-white/10 bg-white text-base font-extrabold text-black shadow-xl shadow-neon-green/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-neon-green hover:shadow-neon-green/25 disabled:translate-y-0 disabled:opacity-70"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                {googleLoginMutation.isPending ? "Signing in..." : "Continue with Google"}
              </Button>

              {showDevLogin && (
                <div className="mt-6 border-t border-white/10 pt-5">
                  <div className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-neon-green">
                    <UserCog className="h-3.5 w-3.5" />
                    Dev Login
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {devLoginOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <Button
                          key={option.role}
                          type="button"
                          variant="outline"
                          onClick={() => handleDevLogin(option.role)}
                          className="h-11 justify-start gap-2 rounded-lg border-white/10 bg-white/5 px-3 text-xs font-bold text-neutral-100 hover:border-neon-green/40 hover:bg-neon-green/10 hover:text-neon-green"
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{option.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-center text-xs font-medium leading-relaxed text-neutral-400">
                  New users are registered as members automatically. Role upgrades are managed by gym admins.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
