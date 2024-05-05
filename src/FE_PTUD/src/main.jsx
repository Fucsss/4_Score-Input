import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import dotenv from "dotenv";
import { AuthProvider } from "./provider/authContext.jsx";

/* dotenv.config(); */

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
