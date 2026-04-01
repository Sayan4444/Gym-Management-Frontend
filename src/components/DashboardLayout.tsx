import { useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProfileDialog } from "@/components/ProfileDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Crown, User as UserIcon } from "lucide-react";
import { useUsers, useSubscriptions, useMembershipPlans, useMe, useLogout } from "@/hooks/useApi";
import { SidebarNav, roleLabels } from "./SidebarNav";

export default function DashboardLayout({ role }: { role: string }) {
  const navigate = useNavigate();
  const { gymName } = useParams();
  const prefix = gymName ? `/${gymName}` : "";
  const [profileOpen, setProfileOpen] = useState(false);

  // Use API hooks
  const usersData = useUsers().data?.users || [];
  const subscriptions = useSubscriptions().data?.subscriptions || [];
  const plans = useMembershipPlans().data?.memberships || [];

  const getSubscriptionByUser = (userId: number) => subscriptions.find((s) => s.userId === userId && s.status === "Active");
  const getPlanById = (planId: number) => plans.find((p) => p.id === planId);

  const { data: me } = useMe();
  const { mutateAsync: logout } = useLogout();

  // Determine the current user based on localStorage and API
  const storedUser = localStorage.getItem("user");
  const authUser = storedUser ? JSON.parse(storedUser) : null;
  const currentUser = usersData.find(u => u.id === authUser?.id) || me || authUser;

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
                          {currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      {role === "member" && (() => {
                        const member = currentUser;
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
                  <DropdownMenuItem onClick={async () => {
                    try {
                      await logout();
                    } catch (_) {}
                    localStorage.removeItem("user");
                    navigate(gymName ? `/${gymName}/login` : "/");
                  }}>
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
