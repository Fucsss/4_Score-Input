import React, { useState } from "react";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import axiosInstance from "../../configs/axios-conf";
function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    setErrors({ ...errors, [name]: "" });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const { email, password } = formData;

    const errors = {};
    if (!email) {
      errors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!password) {
      errors.password = "Please enter a password.";
    }

    if (Object.keys(errors).length === 0) {
      axiosInstance
        .post("/auth/login", {
          email: email,
          password: password,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((errors) => {
          console.log(errors);
        });
    } else {
      setErrors(errors);
    }
  };

  return (
    <div className="form-container sign-in">
      <form onSubmit={handleFormSubmit}>
        <h1>Sign In</h1>
        <span>or use your email and password</span>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? "error" : ""}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}
        <div className="pwStyle" style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "error" : ""}
          />
          <span
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <RiEyeLine /> : <RiEyeCloseLine />}
          </span>
        </div>
        {errors.password && <p className="error-message">{errors.password}</p>}
        <a href="#">Forget Your Password?</a>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default Login;
