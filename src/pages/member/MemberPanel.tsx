import { useSearchParams } from "react-router-dom";
import { AnimatedTabPanel } from "@/components/AnimatedTabPanel";
import MemberDashboard from "./MemberDashboard";
import MemberAttendanceHistory from "./MemberAttendanceHistory";
import MemberSubscription from "./MemberSubscription";
import MemberOrderHistory from "./MemberOrderHistory";
import MemberAddons from "./MemberAddons";
import MemberReview from "./MemberReview";

export default function MemberPanel() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "dashboard";

  let content;
  switch (tab) {
    case "attendance":
      content = <MemberAttendanceHistory />;
      break;
    case "subscription":
      content = <MemberSubscription />;
      break;
    case "orders":
      content = <MemberOrderHistory />;
      break;
    case "addons":
      content = <MemberAddons />;
      break;
    case "review":
      content = <MemberReview />;
      break;
    case "dashboard":
    default:
      content = <MemberDashboard />;
  }

  return <AnimatedTabPanel panelKey={tab}>{content}</AnimatedTabPanel>;
}
