import { useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ProfileDialog } from "@/components/ProfileDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Check, Crown, LogOut, Menu, MessageSquare, Plus, Search, Sparkles, User as UserIcon, X } from "lucide-react";
import { useMembershipPlans, useMe, useLogout, useSubscriptions } from "@/hooks/useApi";
import { SidebarNav } from "./SidebarNav";
import { roleLabels } from "@/lib/constants";

function formatSystemDate() {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

// TODO: Replace this local notification seed with backend notification data when the API exists.
const initialTrayNotifications = [
  {
    id: "renewal-1",
    category: "Renewals",
    message: "2 memberships are approaching renewal. Follow up from the member ledger.",
    time: "Today",
    unread: true,
  },
  {
    id: "payment-1",
    category: "Payments",
    message: "Pending invoice queue needs review for recent membership changes.",
    time: "2 hrs ago",
    unread: true,
  },
  {
    id: "attendance-1",
    category: "Attendance",
    message: "Daily attendance sync completed for the current gym.",
    time: "Yesterday",
    unread: false,
  },
];

export default function DashboardLayout({ role }: { role: string }) {
  const navigate = useNavigate();

  // Local UI state for shell-only interactions.
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [notificationTrayOpen, setNotificationTrayOpen] = useState(false);
  const [trayNotifications, setTrayNotifications] = useState(initialTrayNotifications);

  // Backend-backed user, subscription, and plan data used by the profile area.
  const subscriptionsData = useSubscriptions().data?.subscriptions;
  const membershipPlansData = useMembershipPlans().data?.memberships;
  const { data: currentUser } = useMe();
  const { mutate: logout } = useLogout();

  // Avatar fallback when the backend user has no profile photo.
  const initials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  // Member-only premium badge lookup, based on the active subscription and plan name.
  const hasPremiumPlan = useMemo(() => {
    if (!currentUser || role !== "member") return false;
    const subscriptions = subscriptionsData || [];
    const membershipPlans = membershipPlansData || [];
    const subscription = subscriptions.find((s) => s.userId === currentUser.id && s.status === "Active");
    const plan = subscription ? membershipPlans.find((membership) => membership.id === subscription.planId) : null;
    return Boolean(plan?.name.toLowerCase().includes("premium"));
  }, [currentUser, membershipPlansData, role, subscriptionsData]);

  const unreadNotificationCount = trayNotifications.filter((notification) => notification.unread).length;

  // Existing logout flow: calls backend logout hook, then returns to login.
  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => navigate("/login"),
      onError: (error) => {
        console.error("Logout failed:", error);
        navigate("/login");
      },
    });
  };

  const handleQuickAction = (actionType: string) => {
    const adminActions: Record<string, string> = {
      "add-member": "/admin?tab=members",
      "create-invoice": "/admin?tab=payments",
      "mark-attendance": "/admin?tab=attendance&action=manual-checkin",
      "add-trainer": "/admin?tab=trainers",
    };

    // TODO: Replace trainer/member placeholder quick-action routes with real workflows.
    const trainerActions: Record<string, string> = {
      "add-member": "/trainer?tab=dashboard",
      "create-invoice": "/trainer?tab=dashboard",
      "mark-attendance": "/mark-attendance",
      "add-trainer": "/trainer?tab=workouts",
    };

    const memberActions: Record<string, string> = {
      "add-member": "/member?tab=dashboard",
      "create-invoice": "/member?tab=orders",
      "mark-attendance": "/mark-attendance",
      "add-trainer": "/member?tab=subscription",
    };

    const routeMap = role === "admin" ? adminActions : role === "trainer" ? trainerActions : memberActions;
    navigate(routeMap[actionType] || `/${role}`);
    setQuickActionsOpen(false);
  };

  const handleNotificationsOpen = () => {
    setNotificationTrayOpen(true);
  };

  return (
    <div className="dark min-h-screen bg-[#050505] text-white">
      {/* Mobile-only sidebar open button. */}
      {!sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="fixed left-4 top-4 z-40 rounded-lg border border-white/5 bg-[#111] p-2 text-white shadow-lg shadow-black transition-colors hover:border-[#00BFFF]/30 md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5 text-[#00BFFF]" />
        </button>
      )}

      {/* Role-aware left navigation. Links still route to the existing role tabs. */}
      <SidebarNav role={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-h-screen md:pl-60">
        {/* Sticky topbar shared by admin, trainer, member, and super-admin dashboards. */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-[#0A0A0A] px-5 text-white md:px-8">
          {/* Page status and backend-backed greeting. */}
          <div className="ml-12 flex flex-col md:ml-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-gray-500">Control System</span>
              <span className="inline-flex items-center rounded-full border border-[#39FF14]/10 bg-[#39FF14]/10 px-1.5 py-0.5 text-[9px] font-medium text-[#39FF14]">
                <Sparkles className="mr-1 h-2.5 w-2.5" />
                LIVE
              </span>
            </div>
            <h2 className="-mt-0.5 text-sm font-bold uppercase tracking-tight text-white">
              Good Morning, {currentUser?.name?.split(" ")[0] || roleLabels[role]}
            </h2>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {/* TODO: Wire this visual search input to global record search/filtering. */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search records..."
                className="w-56 rounded-lg border border-white/10 bg-[#171717] py-1.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-[#00BFFF] focus:outline-none lg:w-64"
              />
            </div>

            {/* Quick action menu. Actions route to the existing role screens. */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setQuickActionsOpen((open) => !open)}
                className="flex h-8 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#00BFFF] to-[#39FF14] text-black transition-all hover:shadow-[0_0_15px_rgba(0,191,255,0.4)]"
                aria-label="Quick action"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>

              {quickActionsOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setQuickActionsOpen(false)} />
                  <div className="glass-card absolute right-0 z-40 mt-2.5 w-52 rounded-2xl border border-white/5 p-2 shadow-2xl">
                    <p className="px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#39FF14]">Fast Executions</p>
                    <div className="my-1 h-px bg-white/5" />
                    {[
                      { label: "Add Gym Member", actionType: "add-member" },
                      { label: "Issue Pending Invoice", actionType: "create-invoice" },
                      { label: "Log Daily Attendance", actionType: "mark-attendance" },
                      { label: "Onboard Fitness Trainer", actionType: "add-trainer" },
                    ].map((action) => (
                      <button
                        key={action.actionType}
                        type="button"
                        onClick={() => handleQuickAction(action.actionType)}
                        className="flex w-full items-center rounded-xl px-3 py-2 text-left text-xs text-white transition-colors hover:bg-white/5 hover:text-[#00BFFF]"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* TODO: Replace this static message indicator with real messages/conversations. */}
            <button
              type="button"
              className="relative rounded-full border border-white/5 bg-white/[0.03] p-2.5 text-gray-400 transition-all hover:border-[#00BFFF]/30 hover:bg-white/5 hover:text-white"
              aria-label="Messages"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#00BFFF]" />
            </button>

            {/* TODO: Connect unread count and tray actions to a backend notifications API. */}
            <button
              type="button"
              onClick={handleNotificationsOpen}
              className="relative rounded-full border border-white/5 bg-white/[0.03] p-2.5 text-gray-400 transition-all hover:border-[#39FF14]/30 hover:bg-white/5 hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-lg">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Current system date display. */}
            <div className="hidden border-l border-white/5 pl-4 text-right lg:flex lg:flex-col">
              <span className="font-mono text-[10px] tracking-wider text-gray-500">SYSTEM DATE</span>
              <span className="font-mono text-xs font-bold text-[#39FF14]">{formatSystemDate()}</span>
            </div>

            {/* Backend-backed profile avatar with Profile and Sign out actions. */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="relative hidden rounded-full sm:block" aria-label="Open profile menu">
                  <Avatar className="h-8 w-8 border border-white/20 bg-gradient-to-tr from-gray-700 to-gray-500 shadow-lg">
                    {currentUser?.photoUrl && <AvatarImage src={currentUser.photoUrl} alt={currentUser.name} className="object-cover" />}
                    <AvatarFallback className="bg-transparent text-xs text-white">{initials}</AvatarFallback>
                  </Avatar>
                  {hasPremiumPlan && <Crown className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 fill-yellow-400 text-yellow-500 drop-shadow" />}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-white/10 bg-[#111] text-white">
                <DropdownMenuItem onClick={() => setProfileOpen(true)} className="focus:bg-white/10 focus:text-white">
                  <UserIcon className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={handleLogout} className="focus:bg-white/10 focus:text-white">
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Routed dashboard page content renders here. */}
        <main className="min-h-[calc(100vh-4rem)] bg-[#050505] p-5 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* Existing profile dialog, opened from the avatar dropdown. */}
      {currentUser && <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} user={currentUser} />}

      {/* TODO: This tray is UI-only until notifications are persisted on the backend. */}
      {notificationTrayOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setNotificationTrayOpen(false)} />
          <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-white/10 bg-[#090909] text-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-white/5 p-5">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#39FF14]">Notification Tray</p>
                <h2 className="mt-1 text-lg font-black uppercase tracking-tight">System Notifications</h2>
              </div>
              <button
                type="button"
                onClick={() => setNotificationTrayOpen(false)}
                className="rounded-full border border-white/5 bg-white/[0.03] p-2 text-gray-400 transition-colors hover:text-white"
                aria-label="Close notification tray"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-5">
              {trayNotifications.length > 0 ? (
                trayNotifications.map((notification) => (
                  <div key={notification.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="block font-mono text-[10px] italic text-gray-500">
                          {notification.category} • {notification.time}
                        </span>
                        <p className="mt-1 text-xs leading-relaxed text-gray-300">{notification.message}</p>
                      </div>
                      <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${notification.unread ? "bg-[#39FF14]" : "bg-white/15"}`} />
                    </div>
                    {notification.unread && (
                      <button
                        type="button"
                        onClick={() =>
                          setTrayNotifications((items) =>
                            items.map((item) => (item.id === notification.id ? { ...item, unread: false } : item)),
                          )
                        }
                        className="mt-4 inline-flex items-center gap-1 rounded-lg border border-[#39FF14]/20 bg-[#39FF14]/10 px-2.5 py-1 text-[10px] font-bold text-[#39FF14]"
                      >
                        <Check className="h-3 w-3" />
                        Mark Read
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="py-16 text-center text-xs text-gray-500">Notification logs clear.</p>
              )}
            </div>

            <div className="space-y-2 border-t border-white/5 p-5">
              <button
                type="button"
                onClick={() => setTrayNotifications([])}
                className="w-full rounded-xl border border-red-500/10 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-500 hover:text-white"
              >
                Clear All Logs
              </button>
              {role === "admin" && (
                <button
                  type="button"
                  onClick={() => {
                    setNotificationTrayOpen(false);
                    navigate("/admin?tab=notifications");
                  }}
                  className="w-full rounded-xl border border-[#00BFFF]/20 px-4 py-2.5 text-xs font-bold text-[#00BFFF] transition-colors hover:bg-[#00BFFF]/10 hover:text-white"
                >
                  Open Notifications Page
                </button>
              )}
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
