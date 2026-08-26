import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

import useAuth from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();

  const { registerUser } = useAuth();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setServerError("");

      await registerUser(data);

      navigate("/dashboard");
    } catch (error) {
      setServerError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div>
      <h1>Register</h1>

      {serverError && <p>{serverError}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Name"
          {...register("name", {
            required: "Name is required",
          })}
        />

        {errors.name && <p>{errors.name.message}</p>}

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

            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />

        {errors.password && <p>{errors.password.message}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
