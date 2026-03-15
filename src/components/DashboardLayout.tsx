import { Outlet, useNavigate, useParams, Link, useSearchParams } from "react-router-dom";
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

function getNavItems(role: string, prefix: string): NavItem[] {
  const items: Record<string, NavItem[]> = {
    admin: [
      { title: "Dashboard", url: `${prefix}/admin`, icon: LayoutDashboard },
      { title: "Members", url: `${prefix}/admin/members`, icon: Users },
      { title: "Attendance", url: `${prefix}/admin/attendance`, icon: CalendarCheck },
      { title: "Membership Plans", url: `${prefix}/admin/plans`, icon: ClipboardList },
      { title: "Payments", url: `${prefix}/admin/payments`, icon: CreditCard },
      { title: "Trainers", url: `${prefix}/admin/trainers`, icon: Dumbbell },
      { title: "Reports", url: `${prefix}/admin/reports`, icon: BarChart3 },
      { title: "Settings", url: `${prefix}/admin/settings`, icon: Settings },
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
  const currentTab = searchParams.get("tab") || "overview";

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
                const isTabbedRole = role === "super-admin" || role === "trainer" || role === "member";
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
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {role === "admin" ? "SC" : role === "trainer" ? "MJ" : role === "member" ? "JW" : "AR"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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
        </div>
      </div>
    </SidebarProvider>
  );
}
