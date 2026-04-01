import { useSearchParams } from "react-router-dom";

import AdminDashboard from "./AdminDashboard";
import MembersList from "./MembersList";
import MemberProfile from "./MemberProfile";
import AttendancePage from "./AttendancePage";
import MembershipPlansPage from "./MembershipPlansPage";
import PaymentsPage from "./PaymentsPage";
import TrainersPage from "./TrainersPage";
import ReportsPage from "./ReportsPage";
import SettingsPage from "./SettingsPage";

export default function AdminPanel() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "dashboard";

  switch (tab) {
    case "members":
      return <MembersList />;
    case "member":
      return <MemberProfile />;
    case "attendance":
      return <AttendancePage />;
    case "plans":
      return <MembershipPlansPage />;
    case "payments":
      return <PaymentsPage />;
    case "trainers":
      return <TrainersPage />;
    case "reports":
      return <ReportsPage />;
    case "settings":
      return <SettingsPage />;
    case "dashboard":
    default:
      return <AdminDashboard />;
  }
}
