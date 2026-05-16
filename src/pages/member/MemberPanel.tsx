import { useSearchParams } from "react-router-dom";
import MemberDashboard from "./MemberDashboard";
import MemberAttendanceHistory from "./MemberAttendanceHistory";
import MemberSubscription from "./MemberSubscription";
import MemberOrderHistory from "./MemberOrderHistory";
import MemberAddons from "./MemberAddons";

export default function MemberPanel() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "dashboard";

  switch (tab) {
    case "attendance":
      return <MemberAttendanceHistory />;
    case "subscription":
      return <MemberSubscription />;
    case "orders":
      return <MemberOrderHistory />;
    case "addons":
      return <MemberAddons />;
    case "dashboard":
    default:
      return <MemberDashboard />;
  }
}
