import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard, Users, CalendarCheck, CreditCard, ClipboardList, Dumbbell,
  BarChart3, Settings, Building2, UserCog, LogOut,
} from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const roleNavItems: Record<string, NavItem[]> = {
  admin: [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Members", url: "/admin/members", icon: Users },
    { title: "Attendance", url: "/admin/attendance", icon: CalendarCheck },
    { title: "Membership Plans", url: "/admin/plans", icon: ClipboardList },
    { title: "Payments", url: "/admin/payments", icon: CreditCard },
    { title: "Trainers", url: "/admin/trainers", icon: Dumbbell },
    { title: "Reports", url: "/admin/reports", icon: BarChart3 },
    { title: "Settings", url: "/admin/settings", icon: Settings },
  ],
  trainer: [
    { title: "Dashboard", url: "/trainer", icon: LayoutDashboard },
    { title: "Workout Plans", url: "/trainer/workouts", icon: Dumbbell },
  ],
  member: [
    { title: "Dashboard", url: "/member", icon: LayoutDashboard },
    { title: "Attendance", url: "/member/attendance", icon: CalendarCheck },
    { title: "Subscription", url: "/member/subscription", icon: ClipboardList },
  ],
  "super-admin": [
    { title: "Dashboard", url: "/super-admin", icon: LayoutDashboard },
    { title: "Gyms", url: "/super-admin/gyms", icon: Building2 },
    { title: "Users", url: "/super-admin/users", icon: UserCog },
  ],
};

const roleLabels: Record<string, string> = {
  admin: "Gym Admin",
  trainer: "Trainer",
  member: "Member",
  "super-admin": "Super Admin",
};

function SidebarNav({ role }: { role: string }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const items = roleNavItems[role] || [];

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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === `/${role}`} className="hover:bg-accent/50" activeClassName="bg-accent text-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function DashboardLayout({ role }: { role: string }) {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SidebarNav role={role} />
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
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {role === "admin" ? "SC" : role === "trainer" ? "MJ" : role === "member" ? "JW" : "AR"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/login")}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
