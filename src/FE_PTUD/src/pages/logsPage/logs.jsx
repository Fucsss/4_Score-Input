import React, { useState, useEffect } from "react";
import "../../styles/logs.css";
import Register from "./register.jsx";
import Login from "./login.jsx";

function LogsPage() {
  const [isActiveRegister, setIsActiveRegister] = useState("");

  useEffect(() => {
    const hash = window.location.hash.substr(1);
    if (hash === "signup") {
      setIsActiveRegister("active");
    } else {
      setIsActiveRegister("");
    }
  }, []);

  const handleSignUpClick = () => {
    setIsActiveRegister("active");
    window.location.replace("#signup");
  };

  const handleSignInClick = () => {
    setIsActiveRegister("");
    window.location.replace("#signin");
  };

  return (
    <div className="LogsSite">
      <div className={`loginContainer ${isActiveRegister}`}>
        <Register />
        <Login />
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <h5>Enter your personal details to use all site features</h5>
              <button className="hidden" onClick={handleSignInClick}>
                Sign In
              </button>{" "}
              {/* Pass a function reference to onClick handler */}
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <h5>
                Register with your personal details to use all site features
              </h5>
              <button className="hidden" onClick={handleSignUpClick}>
                Sign Up
              </button>{" "}
              {/* Pass a function reference to onClick handler */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogsPage;
