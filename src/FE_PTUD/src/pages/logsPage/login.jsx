import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import userApi from "../../configs/userApi";
import { useAuth } from "../../provider/authContext";

function Login() {
  const [formData, setFormData] = useState({
    MaGiangVien: "",
    password: "",
  });
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();
  const [errors, setErrors] = useState({});
  const [failLogin, setFailLogin] = useState(false);
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
    const { MaGiangVien, password } = formData;
    const errors = {};
    if (!MaGiangVien) {
      errors.MaGiangVien = "Please enter your teacher ID.";
    }
    if (!password) {
      errors.password = "Please enter a password.";
    }

    if (Object.keys(errors).length === 0) {
      const userInfo = {
        MaGiangVien: MaGiangVien,
        password: password,
      };

      console.log(userInfo);

      userApi
        .login(userInfo)
        .then((response) => {
          console.log(response.data.message);
          console.log(response);
          const accessToken = response.data.token;
          setToken(accessToken);
          localStorage.setItem("token", accessToken);
          // localStorage.setItem("user", JSON.stringify(response.data));
          // setUser(JSON.stringify(response.data));
          navigate("/home");
          // alert(response.data.message);
          //console.log(response.data.message);
        })
        .catch((errors) => {
          console.log(errors);
          setFailLogin(true);
        });
    } else {
      setErrors(errors);
    }
  };

  return (
    <div className="form-container sign-in">
      <form onSubmit={handleFormSubmit}>
        <h1>Sign In</h1>
        <span>or use your teacher ID and password</span>
        <input
          type="text"
          placeholder="Teacher ID"
          name="MaGiangVien"
          value={formData.MaGiangVien}
          onChange={handleChange}
          className={errors.MaGiangVien ? "error" : ""}
        />
        {errors.MaGiangVien && (
          <p className="error-message">{errors.MaGiangVien}</p>
        )}
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
        {failLogin && (
          <p className="error-message">Email or password is incorrect!</p>
        )}
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default Login;
