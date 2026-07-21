import { useEffect, type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { AnimatedTabPanel } from "@/components/AnimatedTabPanel";
import AdminDashboard from "./AdminDashboard";
import MembersList from "./MembersList";
import MemberProfile from "./MemberProfile";
import AttendancePage from "./AttendancePage";
import MembershipPlansPage from "./MembershipPlansPage";
import PaymentsPage from "./PaymentsPage";
import TrainersPage from "./TrainersPage";
import SettingsPage from "./SettingsPage";
import ReviewsPage from "./ReviewsPage";
import PrintableBillingPage from "./PrintableBillingPage";
import BiometricDevicePage from "./BiometricDevicePage";

const validAdminTabs = new Set(["dashboard", "members", "member", "attendance", "biometric-device", "plans", "payments", "billing", "trainers", "reviews", "settings"]);

export default function AdminPanel() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tab = searchParams.get("tab") || "dashboard";

  useEffect(() => {
    if (!validAdminTabs.has(tab)) {
      navigate("/admin?tab=dashboard", { replace: true });
    }
  }, [navigate, tab]);

  let content: ReactNode;
  switch (tab) {
    case "members":
      content = <MembersList />;
      break;
    case "member":
      content = <MemberProfile />;
      break;
    case "attendance":
      content = <AttendancePage />;
      break;
    case "biometric-device":
      content = <BiometricDevicePage />;
      break;
    case "plans":
      content = <MembershipPlansPage />;
      break;
    case "payments":
      content = <PaymentsPage />;
      break;
    case "billing":
      content = <PrintableBillingPage />;
      break;
    case "trainers":
      content = <TrainersPage />;
      break;
    case "reviews":
      content = <ReviewsPage />;
      break;
    case "settings":
      content = <SettingsPage />;
      break;
    case "dashboard":
    default:
      content = <AdminDashboard />;
  }

  return <AnimatedTabPanel panelKey={tab}>{content}</AnimatedTabPanel>;
}
