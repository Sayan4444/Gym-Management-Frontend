import { Link, useSearchParams } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard, Users, CalendarCheck, CreditCard, ClipboardList, Dumbbell,
  BarChart3, Settings, Building2,
} from "lucide-react";

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

export const roleLabels: Record<string, string> = {
  admin: "Gym Admin",
  trainer: "Trainer",
  member: "Member",
  "super-admin": "Super Admin",
};

export function SidebarNav({ role, prefix }: { role: string; prefix: string }) {
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
