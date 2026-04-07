import { useSearchParams } from "react-router-dom";
import WorkoutPlansPage from "./WorkoutPlansPage";
import TrainerDashboard from "./TrainerDashboard";

export default function TrainerPanel() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "dashboard";

  switch (tab) {
    case "workouts":
      return <WorkoutPlansPage />;
    case "dashboard":
    default:
      return <TrainerDashboard />;
  }
}
