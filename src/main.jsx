import React from "react";
import ReactDOM from "react-dom/client"; // For React 18+
import App from "./App";
import "./i18n"; // Import i18n setup file
import './styles/index.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
