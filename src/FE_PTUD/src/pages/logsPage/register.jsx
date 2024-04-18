import React, { useState } from "react";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    const errors = {};
    if (!name) {
      errors.name = "Please enter your name.";
    }
    if (!email) {
      errors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!password) {
      errors.password = "Please enter a password.";
    }
    if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length === 0) {
      alert(`Form submitted successfully! (This is just a simulation)`);
    } else {
      setErrors(errors);
    }
  };

  return (
    <div className="form-container sign-up">
      <form onSubmit={handleFormSubmit}>
        <h1>Create Account</h1>
        <span>or use your email for registration</span>
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? "error" : ""}
        />
        {errors.name && <p className="error-message">{errors.name}</p>}
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
            className={errors.email ? "error" : ""}
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
        <div className="pwStyle" style={{ position: "relative" }}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? "error" : ""}
          />
          <span
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? <RiEyeLine /> : <RiEyeCloseLine />}
          </span>
        </div>
        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword}</p>
        )}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Register;
