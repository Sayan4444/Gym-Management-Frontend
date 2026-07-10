import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  Activity,
  Box,
  Building2,
  CalendarCheck,
  CreditCard,
  Dumbbell,
  Flame,
  Landmark,
  MessageSquareQuote,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useGym, useMe } from "@/hooks/useApi";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  tab: string;
  url: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: string | number }>;
}

function getNavItems(role: string): NavItem[] {
  const items: Record<string, NavItem[]> = {
    admin: [
      { title: "Dashboard", tab: "dashboard", url: "/admin?tab=dashboard", icon: Activity },
      { title: "Members", tab: "members", url: "/admin?tab=members", icon: Users },
      { title: "Membership Plans", tab: "plans", url: "/admin?tab=plans", icon: Landmark },
      { title: "Trainers", tab: "trainers", url: "/admin?tab=trainers", icon: Dumbbell },
      { title: "Attendance", tab: "attendance", url: "/admin?tab=attendance", icon: CalendarCheck },
      { title: "Payments", tab: "payments", url: "/admin?tab=payments", icon: CreditCard },
      { title: "Reviews", tab: "reviews", url: "/admin?tab=reviews", icon: MessageSquareQuote },
      { title: "Settings", tab: "settings", url: "/admin?tab=settings", icon: Settings },
    ],
    trainer: [
      { title: "Dashboard", tab: "dashboard", url: "/trainer?tab=dashboard", icon: Activity },
      { title: "Workout Programs", tab: "workouts", url: "/trainer?tab=workouts", icon: Flame },
    ],
    member: [
      { title: "Dashboard", tab: "dashboard", url: "/member?tab=dashboard", icon: Activity },
      { title: "Attendance", tab: "attendance", url: "/member?tab=attendance", icon: CalendarCheck },
      { title: "Subscription", tab: "subscription", url: "/member?tab=subscription", icon: Landmark },
      { title: "Add-ons", tab: "addons", url: "/member?tab=addons", icon: Box },
      { title: "Payment History", tab: "orders", url: "/member?tab=orders", icon: CreditCard },
      { title: "My Review", tab: "review", url: "/member?tab=review", icon: MessageSquareQuote },
    ],
    "super-admin": [
      { title: "Dashboard", tab: "overview", url: "/super-admin?tab=overview", icon: Activity },
      { title: "Gyms", tab: "gyms", url: "/super-admin?tab=gyms", icon: Building2 },
      { title: "Users", tab: "users", url: "/super-admin?tab=users", icon: Users },
    ],
  };

  return items[role] || [];
}

export function SidebarNav({
  role,
  isOpen,
  onClose,
}: {
  role: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const items = getNavItems(role);
  const defaultTab = role === "super-admin" ? "overview" : "dashboard";
  const currentTab = searchParams.get("tab") || defaultTab;

  const me = useMe().data;
  const gym = useGym(me?.gymId).data;
  const gymName = role === "super-admin" ? "Transform 360" : gym?.name || "Transform 360";
  const gymIcon = role !== "super-admin" && gym?.gymIcon ? gym.gymIcon : null;

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={onClose} />}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-white/5 bg-[#0A0A0A] text-white transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-white/5 p-6">
          <Link to={role === "super-admin" ? "/super-admin" : `/${role}`} className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#00BFFF] to-[#39FF14]">
              {gymIcon ? (
                <img src={gymIcon} alt={gymName} className="h-full w-full object-cover" />
              ) : (
                <span className="text-[10px] font-black text-black">T360</span>
              )}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold uppercase tracking-tight text-white">
                {gymName.split(" ")[0] || "Transform"} <span className="text-[#00BFFF]">360</span>
              </h1>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-white/5 p-1 text-gray-400 transition-colors hover:text-white md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="custom-scrollbar flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
          {items.map((item) => {
            const Icon = item.icon;
            const active =
              currentTab === item.tab ||
              (item.tab === defaultTab && location.search === "" && location.pathname === item.url.split("?")[0]);

            return (
              <Link
                key={item.title}
                to={item.url}
                onClick={onClose}
                className={cn(
                  "group relative flex w-full items-center gap-3 px-3 py-2 text-left text-sm font-medium tracking-wide transition-colors",
                  active
                    ? "rounded-r-md border-l-2 border-[#00BFFF] bg-white/5 text-[#00BFFF]"
                    : "text-gray-500 hover:text-white",
                )}
              >
                <Icon
                  className={cn("h-4 w-4 transition-colors", active ? "text-[#00BFFF]" : "text-gray-500 group-hover:text-white")}
                  strokeWidth={active ? 2 : 1.7}
                />
                <span className="truncate">{item.title}</span>
                {!active && (
                  <span className="absolute right-4 h-1.5 w-1.5 scale-0 rounded-full bg-[#39FF14] opacity-60 transition-transform duration-300 group-hover:scale-100" />
                )}
              </Link>
            );
          })}
        </nav>

      </aside>
    </>
  );
}
