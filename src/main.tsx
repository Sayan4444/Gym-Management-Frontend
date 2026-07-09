import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// TODO: Split heavy routes/components with dynamic imports to reduce the main Vite bundle size warning.
createRoot(document.getElementById("root")!).render(<App />);
