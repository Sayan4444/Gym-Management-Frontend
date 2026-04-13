import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';

import LandingPage from "./pages/LandingPage";
import GymHomePage from "./pages/GymHomePage";
import LoginPage from "./pages/LoginPage";
import PricingPage from "./pages/PricingPage";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";
import UnauthorizedPage from "./pages/Unauthorized";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ValidGymRoute from "./components/ValidGymRoute";

// Admin pages
import AdminPanel from "./pages/admin/AdminPanel";

// Member pages
import MemberPanel from "./pages/member/MemberPanel";

// Mark Attendance Route
import MarkAttendancePage from "./pages/MarkAttendancePage";

// Super Admin pages
import SuperAdminDashboard from "./pages/super-admin/SuperAdminDashboard";
import BookDemoPage from "./pages/BookDemoPage";

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import TrainerPanel from "./pages/trainer/TrainerPanel";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const clientId = window.env?.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_GOOGLE_CLIENT_ID

const App = () => (
  <GoogleOAuthProvider clientId={clientId}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/bookslot" element={<BookDemoPage />} />

              {/* Super Admin routes (no gymName prefix) */}
              <Route element={<ProtectedRoute allowedRoles={['SuperAdmin']} />}>
                <Route path="/super-admin" element={<DashboardLayout role="super-admin" />}>
                  <Route index element={<SuperAdminDashboard />} />
                </Route>
              </Route>

              {/* Gym-specific routes */}
              <Route path="/:gymName" element={<ValidGymRoute />}>
                <Route index element={<GymHomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="pricing" element={<PricingPage />} />

                <Route element={<ProtectedRoute allowedRoles={['GymAdmin', 'Trainer', 'Member']} />}>
                  <Route path="mark-attendance" element={<MarkAttendancePage />} />
                </Route>

                {/* Gym Admin routes */}
                <Route element={<ProtectedRoute allowedRoles={['GymAdmin']} />}>
                  <Route path="admin" element={<DashboardLayout role="admin" />}>
                    <Route index element={<AdminPanel />} />
                  </Route>
                </Route>

                {/* Trainer routes */}
                <Route element={<ProtectedRoute allowedRoles={['Trainer']} />}>
                  <Route path="trainer" element={<DashboardLayout role="trainer" />}>
                    <Route index element={<TrainerPanel />} />
                  </Route>
                </Route>

                {/* Member routes */}
                <Route element={<ProtectedRoute allowedRoles={['Member']} />}>
                  <Route path="member" element={<DashboardLayout role="member" />}>
                    <Route index element={<MemberPanel />} />
                  </Route>
                </Route>
              </Route>

              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  </GoogleOAuthProvider>
);

export default App;
