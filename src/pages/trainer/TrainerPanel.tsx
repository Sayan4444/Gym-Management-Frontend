import { useSearchParams } from "react-router-dom";
import { AnimatedTabPanel } from "@/components/AnimatedTabPanel";
import { useMe } from "@/hooks/useApi";
import MemberAttendanceHistory from "../member/MemberAttendanceHistory";
import WorkoutPlansPage from "./WorkoutPlansPage";
import TrainerDashboard from "./TrainerDashboard";

export default function TrainerPanel() {
  const [searchParams] = useSearchParams();
  const me = useMe().data;
  const tab = searchParams.get("tab") || "dashboard";

  let content;
  switch (tab) {
    case "workouts":
      content = <WorkoutPlansPage />;
      break;
    case "attendance":
      content = <MemberAttendanceHistory userId={me?.id ?? -1} />;
      break;
    case "dashboard":
    default:
      content = <TrainerDashboard />;
  }

  return <AnimatedTabPanel panelKey={tab}>{content}</AnimatedTabPanel>;
}
