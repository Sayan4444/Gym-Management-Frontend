import { useSearchParams } from "react-router-dom";

import AdminDashboard from "./AdminDashboard";
import MembersList from "./MembersList";
import MemberProfile from "./MemberProfile";
import AttendancePage from "./AttendancePage";
import MembershipPlansPage from "./MembershipPlansPage";
import AddonsPage from "./AddonsPage";
import PaymentsPage from "./PaymentsPage";
import TrainersPage from "./TrainersPage";
import ReportsPage from "./ReportsPage";
import SettingsPage from "./SettingsPage";

function EmptyAdminModule({ title, description }: { title: string; description: string }) {
  // TODO: Replace this placeholder with the real routed module for each empty sidebar item.
  return (
    <div className="rounded-2xl border border-white/5 bg-[#111111]/50 p-8 text-white shadow-2xl">
      <div className="max-w-xl space-y-3">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#39FF14]">Module Placeholder</p>
        <h1 className="text-2xl font-black uppercase tracking-tight">{title}</h1>
        <p className="text-sm leading-relaxed text-gray-400">{description}</p>
      </div>
    </div>
  );
}

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
    case "addons":
      return <AddonsPage />;
    case "payments":
      return <PaymentsPage />;
    case "workouts":
      return <EmptyAdminModule title="Workout Programs" description="Workout program management is reserved here for the admin UI. The menu is active so the dashboard layout matches the reference app." />;
    case "diets":
      return <EmptyAdminModule title="Diet Plans" description="Diet planning screens can be connected here when the backend workflow is ready." />;
    case "inventory":
      return <EmptyAdminModule title="Inventory" description="Inventory and maintenance tracking has a routed home here, ready for future implementation." />;
    case "analytics":
      return <EmptyAdminModule title="Analytics" description="Detailed analytics can be expanded here. The core dashboard charts remain available on the Dashboard tab." />;
    case "notifications":
      return <EmptyAdminModule title="Notifications" description="Use the bell in the topbar to open the notification tray. This tab is kept as a routed placeholder for sidebar parity." />;
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
