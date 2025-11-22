import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./styles.css";
import { BrowserRouter } from "react-router-dom";
import { PlannerProvider } from "./context/PlannerContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <PlannerProvider>
      <App />
    </PlannerProvider>
  </BrowserRouter>
);
