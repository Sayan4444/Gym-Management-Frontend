import { useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ProfileDialog } from "@/components/ProfileDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Check, Crown, LogOut, Menu, Search, Sparkles, Trash2, User as UserIcon, X } from "lucide-react";
import {
  useDismissAllNotifications,
  useDismissNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useMembershipPlans,
  useMe,
  useLogout,
  useNotifications,
  useSubscriptions,
} from "@/hooks/useApi";
import type { Notification } from "@/data/types";
import { SidebarNav } from "./SidebarNav";
import { roleLabels } from "@/lib/constants";

function formatSystemDate() {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function formatNotificationType(type: string) {
  return type
    .split(".")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" · ");
}

function formatNotificationTime(createdAt: string) {
  try {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  } catch {
    return "Recently";
  }
}

const dashboardTitles: Record<string, string> = {
  admin: "Admin Dashboard",
  trainer: "Trainer Dashboard",
  member: "Member Dashboard",
  "super-admin": "Super Admin Dashboard",
};

export default function DashboardLayout({ role }: { role: string }) {
  const navigate = useNavigate();
  const dashboardTitle = dashboardTitles[role] || "Dashboard";

  // Local UI state for shell-only interactions.
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [notificationTrayOpen, setNotificationTrayOpen] = useState(false);

  // Backend-backed user, subscription, and plan data used by the profile area.
  const subscriptionsData = useSubscriptions().data?.subscriptions;
  const membershipPlansData = useMembershipPlans().data?.memberships;
  const { data: currentUser } = useMe();
  const { mutate: logout } = useLogout();
  const {
    data: notificationData,
    isLoading: notificationsLoading,
    isError: notificationsError,
    refetch: refetchNotifications,
    fetchNextPage: fetchNextNotificationsPage,
    hasNextPage: hasNextNotificationsPage,
    isFetchingNextPage: fetchingNextNotificationsPage,
  } = useNotifications();
  const { mutate: markNotificationRead } = useMarkNotificationRead();
  const { mutate: markAllNotificationsRead, isPending: markingAllRead } = useMarkAllNotificationsRead();
  const { mutate: dismissNotification } = useDismissNotification();
  const { mutate: dismissAllNotifications, isPending: dismissingAll } = useDismissAllNotifications();

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

  const trayNotifications = notificationData?.pages.flatMap((page) => page.notifications) ?? [];
  const unreadNotificationCount = notificationData?.pages[0]?.unreadCount ?? 0;

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
    const quickLinkRoutes: Record<string, string> = {
      "add-member": "/admin?tab=members",
      "create-invoice": "/admin?tab=billing",
      "log-attendance": "/admin?tab=attendance&action=manual-checkin",
      "add-trainer": "/admin?tab=trainers",
    };

    navigate(quickLinkRoutes[actionType] || "/admin");
    setQuickActionsOpen(false);
  };

  const handleNotificationsOpen = () => {
    setNotificationTrayOpen(true);
    void refetchNotifications();
  };

  const handleNotificationOpen = (notification: Notification) => {
    if (!notification.readAt) markNotificationRead(notification.id);
    if (notification.actionUrl?.startsWith("/")) {
      navigate(notification.actionUrl);
      setNotificationTrayOpen(false);
    }
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
        <header className="sticky top-0 z-30 flex h-16 min-w-0 items-center justify-between gap-2 border-b border-white/5 bg-[#0A0A0A] px-3 text-white min-[360px]:px-4 md:px-8">
          {/* Page status and backend-backed greeting. */}
          <div className="ml-11 flex min-w-0 flex-col min-[360px]:ml-12 md:ml-0">
            <div className="flex items-center gap-2">
              <span className="truncate font-mono text-[10px] uppercase tracking-wider text-gray-500 sm:text-xs sm:tracking-widest">{dashboardTitle}</span>
              <span className="inline-flex items-center rounded-full border border-[#39FF14]/10 bg-[#39FF14]/10 px-1.5 py-0.5 text-[9px] font-medium text-[#39FF14]">
                <Sparkles className="mr-1 h-2.5 w-2.5" />
                LIVE
              </span>
            </div>
            <h2 className="-mt-0.5 truncate text-xs font-bold uppercase tracking-tight text-white sm:text-sm">
              Good Morning, {currentUser?.name?.split(" ")[0] || roleLabels[role]}
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 min-[360px]:gap-2 md:gap-4">
            {/* TODO: Wire this visual search input to global record search/filtering. */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search records..."
                className="w-56 rounded-lg border border-white/10 bg-[#171717] py-1.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-[#00BFFF] focus:outline-none lg:w-64"
              />
            </div>

            {/* Admin-only quick links menu. */}
            {role === "admin" && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setQuickActionsOpen((open) => !open)}
                  className="flex h-9 items-center justify-center whitespace-nowrap rounded-xl bg-gradient-to-r from-[#00BFFF] to-[#39FF14] px-2.5 text-[10px] font-black uppercase tracking-wide text-black transition-all hover:shadow-[0_0_15px_rgba(0,191,255,0.4)] min-[390px]:px-3 min-[390px]:text-xs"
                  aria-label="Quick Links"
                >
                  Quick Links
                </button>

                {quickActionsOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setQuickActionsOpen(false)} />
                    <div className="glass-card absolute right-0 z-40 mt-2.5 w-52 rounded-2xl border border-white/5 p-2 shadow-2xl">
                      {[
                        { label: "Add Gym Member", actionType: "add-member" },
                        { label: "Issue Pending Invoice", actionType: "create-invoice" },
                        { label: "Log Daily Attendance", actionType: "log-attendance" },
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
            )}

            <button
              type="button"
              onClick={handleNotificationsOpen}
              className="relative rounded-full border border-white/5 bg-white/[0.03] p-2.5 text-gray-400 transition-all hover:border-[#39FF14]/30 hover:bg-white/5 hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-lg">
                  {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
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
        <main className="min-h-[calc(100vh-4rem)] min-w-0 overflow-x-hidden bg-[#050505] p-3 min-[360px]:p-4 sm:p-5 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* Existing profile dialog, opened from the avatar dropdown. */}
      {currentUser && <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} user={currentUser} />}

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
              {notificationsLoading ? (
                <p className="py-16 text-center text-xs text-gray-500">Loading notifications...</p>
              ) : notificationsError ? (
                <div className="py-16 text-center">
                  <p className="text-xs text-red-400">Notifications could not be loaded.</p>
                  <button
                    type="button"
                    onClick={() => void refetchNotifications()}
                    className="mt-3 rounded-lg border border-white/10 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-white/5"
                  >
                    Try Again
                  </button>
                </div>
              ) : trayNotifications.length > 0 ? (
                <>
                  {trayNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`rounded-xl border p-4 transition-colors ${
                        notification.readAt ? "border-white/5 bg-white/[0.02]" : "border-[#39FF14]/15 bg-[#39FF14]/[0.035]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <button type="button" onClick={() => handleNotificationOpen(notification)} className="min-w-0 flex-1 text-left">
                          <span className="block font-mono text-[10px] italic text-gray-500">
                            {formatNotificationType(notification.type)} • {formatNotificationTime(notification.createdAt)}
                          </span>
                          <p className="mt-1 text-xs font-bold text-white">{notification.title}</p>
                          <p className="mt-1 text-xs leading-relaxed text-gray-300">{notification.message}</p>
                        </button>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${notification.readAt ? "bg-white/15" : "bg-[#39FF14]"}`} />
                          <button
                            type="button"
                            onClick={() => dismissNotification(notification.id)}
                            className="rounded-md p-1 text-gray-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
                            aria-label={`Dismiss ${notification.title}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      {!notification.readAt && (
                        <button
                          type="button"
                          onClick={() => markNotificationRead(notification.id)}
                          className="mt-4 inline-flex items-center gap-1 rounded-lg border border-[#39FF14]/20 bg-[#39FF14]/10 px-2.5 py-1 text-[10px] font-bold text-[#39FF14]"
                        >
                          <Check className="h-3 w-3" />
                          Mark Read
                        </button>
                      )}
                    </div>
                  ))}
                  {hasNextNotificationsPage && (
                    <button
                      type="button"
                      onClick={() => void fetchNextNotificationsPage()}
                      disabled={fetchingNextNotificationsPage}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-bold text-gray-300 transition-colors hover:bg-white/[0.06] disabled:opacity-50"
                    >
                      {fetchingNextNotificationsPage ? "Loading..." : "Load Older Notifications"}
                    </button>
                  )}
                </>
              ) : (
                <p className="py-16 text-center text-xs text-gray-500">Notification logs clear.</p>
              )}
            </div>

            <div className="space-y-2 border-t border-white/5 p-5">
              {unreadNotificationCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllNotificationsRead()}
                  disabled={markingAllRead}
                  className="w-full rounded-xl border border-[#39FF14]/15 bg-[#39FF14]/10 px-4 py-2.5 text-xs font-bold text-[#39FF14] transition-colors hover:bg-[#39FF14]/20 disabled:opacity-50"
                >
                  {markingAllRead ? "Marking..." : "Mark All Read"}
                </button>
              )}
              <button
                type="button"
                onClick={() => dismissAllNotifications()}
                disabled={trayNotifications.length === 0 || dismissingAll}
                className="w-full rounded-xl border border-red-500/10 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {dismissingAll ? "Clearing..." : "Clear All Logs"}
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
