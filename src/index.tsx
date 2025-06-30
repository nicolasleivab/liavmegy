import "./presentation/theme/reset.css";
import "./presentation/theme/variables.css";
import { createRoot } from "react-dom/client";
import App from "./application/App";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
