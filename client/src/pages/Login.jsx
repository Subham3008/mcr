import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

import useAuth from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setServerError("");

      await login(data);

      navigate("/dashboard");
    } catch (error) {
      setServerError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      {serverError && <p>{serverError}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
          })}
        />

        {errors.email && <p>{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
          })}
        />

        {errors.password && <p>{errors.password.message}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
