import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../../config";
import { writeLoginLog } from "./loginLogger";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextData = { ...formData, [name]: value };
    setFormData(nextData);

    writeLoginLog("input_change", {
      field: name,
      email: nextData.email,
      password: nextData.password,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    writeLoginLog("submit_attempt", {
      email: formData.email,
      password: formData.password,
      endpoint: `${API_URL}/auth/login`,
    });

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      writeLoginLog("submit_response", {
        email: formData.email,
        status: response.status,
        ok: response.ok,
        message: data?.message,
        token: data?.token,
        data,
      });

      if (response.ok) {
        localStorage.setItem("token", data.token);
        writeLoginLog("login_success", {
          email: formData.email,
          token: data?.token,
        });
        navigate("/dashboard");
      } else {
        writeLoginLog("login_failed", {
          email: formData.email,
          status: response.status,
          message: data?.message,
        });
        alert("Login failed: " + data.message);
      }
    } catch (error) {
      writeLoginLog("login_error", {
        email: formData.email,
        error: error?.message,
      });
      console.error("Error:", error);
      alert("Server error. Are you sure the backend is running?");
    }
  };

  return (
    <Form className="auth-form" onSubmit={handleSubmit}>
      <h1>Sign in</h1>
      <span>use your account</span>

      <Form.Control
        type="email"
        placeholder="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="mb-3"
        style={{ color: "black" }}
      />
      <Form.Control
        type="password"
        placeholder="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        className="mb-3"
        style={{ color: "black" }}
      />

      <Link
        to="/forgot-password"
        style={{
          fontSize: "12px",
          marginBottom: "15px",
          display: "block",
          color: "#0076f4",
        }}
      >
        Forgot your password?
      </Link>
      <Button type="submit" variant="primary">
        Sign In
      </Button>
    </Form>
  );
}

export default Login;
