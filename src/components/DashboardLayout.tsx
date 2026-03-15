import { useState } from "react";
import { Outlet, useNavigate, useParams, Link, useSearchParams } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProfileDialog } from "@/components/ProfileDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard, Users, CalendarCheck, CreditCard, ClipboardList, Dumbbell,
  BarChart3, Settings, Building2, UserCog, LogOut, Crown, User as UserIcon,
} from "lucide-react";
import { users, getSubscriptionByUser, getPlanById } from "@/data/dummy";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

function getNavItems(role: string, prefix: string): NavItem[] {
  const items: Record<string, NavItem[]> = {
    admin: [
      { title: "Dashboard", url: `${prefix}/admin?tab=dashboard`, icon: LayoutDashboard },
      { title: "Members", url: `${prefix}/admin?tab=members`, icon: Users },
      { title: "Attendance", url: `${prefix}/admin?tab=attendance`, icon: CalendarCheck },
      { title: "Membership Plans", url: `${prefix}/admin?tab=plans`, icon: ClipboardList },
      { title: "Payments", url: `${prefix}/admin?tab=payments`, icon: CreditCard },
      { title: "Trainers", url: `${prefix}/admin?tab=trainers`, icon: Dumbbell },
      { title: "Reports", url: `${prefix}/admin?tab=reports`, icon: BarChart3 },
      { title: "Settings", url: `${prefix}/admin?tab=settings`, icon: Settings },
    ],
    trainer: [
      { title: "Dashboard", url: `${prefix}/trainer?tab=dashboard`, icon: LayoutDashboard },
      { title: "Workout Plans", url: `${prefix}/trainer?tab=workouts`, icon: Dumbbell },
    ],
    member: [
      { title: "Dashboard", url: `${prefix}/member?tab=dashboard`, icon: LayoutDashboard },
      { title: "Attendance", url: `${prefix}/member?tab=attendance`, icon: CalendarCheck },
      { title: "Subscription", url: `${prefix}/member?tab=subscription`, icon: ClipboardList },
    ],
    "super-admin": [
      { title: "Dashboard", url: "/super-admin?tab=overview", icon: LayoutDashboard },
      { title: "Gyms", url: "/super-admin?tab=gyms", icon: Building2 },
      { title: "Users", url: "/super-admin?tab=users", icon: Users },
    ],
  };
  return items[role] || [];
}

const roleLabels: Record<string, string> = {
  admin: "Gym Admin",
  trainer: "Trainer",
  member: "Member",
  "super-admin": "Super Admin",
};

function SidebarNav({ role, prefix }: { role: string; prefix: string }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const items = getNavItems(role, prefix);
  const baseUrl = role === "super-admin" ? "/super-admin" : `${prefix}/${role}`;
  const [searchParams] = useSearchParams();
  const defaultTab = role === "super-admin" ? "overview" : "dashboard";
  const currentTab = searchParams.get("tab") || defaultTab;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Dumbbell className="h-7 w-7 text-primary" />
              <span className="font-display text-lg font-bold text-foreground">GymFlow</span>
            </div>
          )}
          {collapsed && <Dumbbell className="h-7 w-7 text-primary mx-auto" />}
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>{roleLabels[role]}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isTabbedRole = role === "super-admin" || role === "trainer" || role === "member" || role === "admin";
                const isTabActive = isTabbedRole && (
                  item.url.includes(`tab=${currentTab}`) || 
                  (item.url.endsWith(`/${role}`) && currentTab === "dashboard") ||
                  (item.url.endsWith("/super-admin") && currentTab === "overview")
                );

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      {isTabbedRole ? (
                        <Link 
                          to={item.url} 
                          className={`hover:bg-accent/50 ${isTabActive ? "bg-accent text-primary font-medium" : ""}`}
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </Link>
                      ) : (
                        <NavLink to={item.url} end={item.url === baseUrl} className="hover:bg-accent/50" activeClassName="bg-accent text-primary font-medium">
                          <item.icon className="mr-2 h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function DashboardLayout({ role }: { role: string }) {
  const navigate = useNavigate();
  const { gymName } = useParams();
  const prefix = gymName ? `/${gymName}` : "";
  const [profileOpen, setProfileOpen] = useState(false);

  // Determine the current user based on role
  const currentUser = role === "member" ? users.find(u => u.id === 7)
    : role === "admin" ? users.find(u => u.id === 2)
    : role === "trainer" ? users.find(u => u.id === 4)
    : users.find(u => u.id === 1);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SidebarNav role={role} prefix={prefix} />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b px-4 bg-card">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
                {roleLabels[role]} Panel
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {role === "admin" ? "SC" : role === "trainer" ? "MJ" : role === "member" ? "JW" : "AR"}
                        </AvatarFallback>
                      </Avatar>
                      {role === "member" && (() => {
                        const member = users.find(u => u.id === 7);
                        if (!member) return null;
                        const sub = getSubscriptionByUser(member.id);
                        const plan = sub ? getPlanById(sub.planId) : null;
                        return plan?.name.toLowerCase().includes("premium") ? (
                          <Crown className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 text-yellow-500 fill-yellow-400 drop-shadow" />
                        ) : null;
                      })()}
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                    <UserIcon className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(gymName ? `/${gymName}/login` : "/super-admin/login")}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
          {currentUser && (
            <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} user={currentUser} />
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}
