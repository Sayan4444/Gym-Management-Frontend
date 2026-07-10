import { useSearchParams } from "react-router-dom";
import { AnimatedTabPanel } from "@/components/AnimatedTabPanel";
import WorkoutPlansPage from "./WorkoutPlansPage";
import TrainerDashboard from "./TrainerDashboard";

export default function TrainerPanel() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "dashboard";

  let content;
  switch (tab) {
    case "workouts":
      content = <WorkoutPlansPage />;
      break;
    case "dashboard":
    default:
      content = <TrainerDashboard />;
  }

  return <AnimatedTabPanel panelKey={tab}>{content}</AnimatedTabPanel>;
}
