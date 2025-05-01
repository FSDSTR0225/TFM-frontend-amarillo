import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AdvancedForm from "./pages/AdvanceForm.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdvancedForm />
  </StrictMode>
);
