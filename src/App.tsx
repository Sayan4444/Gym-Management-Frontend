import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";

import LandingPage from "./pages/LandingPage";
import GymHomePage from "./pages/GymHomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DemoPage from "./pages/DemoPage";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import MembersList from "./pages/admin/MembersList";
import MemberProfile from "./pages/admin/MemberProfile";
import AttendancePage from "./pages/admin/AttendancePage";
import MembershipPlansPage from "./pages/admin/MembershipPlansPage";
import PaymentsPage from "./pages/admin/PaymentsPage";
import TrainersPage from "./pages/admin/TrainersPage";
import ReportsPage from "./pages/admin/ReportsPage";
import SettingsPage from "./pages/admin/SettingsPage";

// Trainer pages
import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import WorkoutPlansPage from "./pages/trainer/WorkoutPlansPage";

// Member pages
import MemberDashboard from "./pages/member/MemberDashboard";
import MemberAttendanceHistory from "./pages/member/MemberAttendanceHistory";
import MemberSubscription from "./pages/member/MemberSubscription";

// Super Admin pages
import SuperAdminDashboard from "./pages/super-admin/SuperAdminDashboard";
import GymManagement from "./pages/super-admin/GymManagement";
import SuperAdminUsers from "./pages/super-admin/SuperAdminUsers";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Super Admin routes (no gymName prefix) */}
            <Route path="/super-admin" element={<DashboardLayout role="super-admin" />}>
              <Route index element={<SuperAdminDashboard />} />
              <Route path="gyms" element={<GymManagement />} />
              <Route path="users" element={<SuperAdminUsers />} />
            </Route>

            {/* Gym-specific routes */}
            <Route path="/:gymName" element={<GymHomePage />} />
            <Route path="/:gymName/demo" element={<DemoPage />} />
            <Route path="/:gymName/pricing" element={<LandingPage />} />

            {/* Gym Admin routes */}
            <Route path="/:gymName/admin" element={<DashboardLayout role="admin" />}>
              <Route index element={<AdminDashboard />} />
              <Route path="members" element={<MembersList />} />
              <Route path="members/:id" element={<MemberProfile />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="plans" element={<MembershipPlansPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="trainers" element={<TrainersPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Trainer routes */}
            <Route path="/:gymName/trainer" element={<DashboardLayout role="trainer" />}>
              <Route index element={<TrainerDashboard />} />
              <Route path="workouts" element={<WorkoutPlansPage />} />
            </Route>

            {/* Member routes */}
            <Route path="/:gymName/member" element={<DashboardLayout role="member" />}>
              <Route index element={<MemberDashboard />} />
              <Route path="attendance" element={<MemberAttendanceHistory />} />
              <Route path="subscription" element={<MemberSubscription />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
