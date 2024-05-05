import React, { useState } from "react";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import userApi from "../../configs/userApi";
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    HoVaTen: "", 
    MaGiangVien: "", 
    Email: "", 
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

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

    const { HoVaTen, MaGiangVien, Email, password, confirmPassword } = formData;

    const errors = {};
    if (!HoVaTen) {
      errors.HoVaTen = "Please enter your name.";
    }
    if (!MaGiangVien) {
      errors.MaGiangVien = "Please enter your Teacher ID.";
    }
    if (!Email) {
      errors.Email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
      errors.Email = "Please enter a valid email address.";
    }
    if (!password) {
      errors.password = "Please enter a password.";
    }
    if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length === 0) {
      const userInfo = {
        MaGiangVien: MaGiangVien,
        HoVaTen: HoVaTen,
        TenKhoa: "CNTT",
        Email: Email,
        SDT: "0123456789",
        password: password,
      };
      console.log(userInfo);
      userApi.register(userInfo).then((response) => {
        console.log(response);
        console.log(response.data.message);
        message.success(response.data.message);
        window.location.replace("#signin");
      })
      .catch((errors) => {
        console.log(errors.response.data.message);
        setNotification(errors.response.data.message);
        message.error(errors.response.data.message);
      });

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
          name="HoVaTen" 
          value={formData.HoVaTen} 
          onChange={handleChange}
          className={errors.HoVaTen ? "error" : ""}
        />
        {errors.HoVaTen && <p className="error-message">{errors.HoVaTen}</p>}
        <input
          type="text"
          placeholder="Teacher ID"
          name="MaGiangVien" 
          value={formData.MaGiangVien} 
          onChange={handleChange}
          className={errors.MaGiangVien ? "error" : ""}
        />
        {errors.MaGiangVien && <p className="error-message">{errors.MaGiangVien}</p>}
        <input
          type="email"
          placeholder="Email"
          name="Email" 
          value={formData.Email} 
          onChange={handleChange}
          className={errors.Email ? "error" : ""}
        />
        {errors.Email && <p className="error-message">{errors.Email}</p>}
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
        {notification ? <p className="error-message">{notification}</p> : ""}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Register;
