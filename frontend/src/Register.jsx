
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (form.name.trim().length < 2) {
      setMessage("Please enter your full name.");
      return;
    }

    if (form.password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    // Temporary frontend-only demonstration.
    // Do not store real passwords in browser storage.
    setMessage("Registration form validated successfully!");

    setTimeout(() => {
      navigate("/");
    }, 1200);
  }

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "6px",
    marginBottom: "16px",
    border: "1px solid #d2ddd4",
    borderRadius: "8px",
    boxSizing: "border-box",
    fontSize: "15px",
  };

  const labelStyle = {
    display: "block",
    color: "#24352b",
    fontWeight: "600",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f7f1",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "430px",
          padding: "32px",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ color: "#237447", marginBottom: "8px" }}>
            Health Tracker
          </h1>
          <h2 style={{ color: "#24352b", fontSize: "22px" }}>
            Create your account
          </h2>
          <p style={{ color: "#647067", marginTop: "8px" }}>
            Start organizing your daily health routine.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name" style={labelStyle}>
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            required
            style={inputStyle}
          />

          <label htmlFor="email" style={labelStyle}>
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
            style={inputStyle}
          />

          <label htmlFor="password" style={labelStyle}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={8}
            required
            style={inputStyle}
          />

          <label htmlFor="confirmPassword" style={labelStyle}>
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password again"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            required
            style={inputStyle}
          />

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "18px",
              color: "#647067",
              fontSize: "14px",
            }}
          >
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(event) => setShowPassword(event.target.checked)}
            />
            Show passwords
          </label>

          {message && (
            <p
              role="status"
              style={{
                color: message.startsWith("Registration")
                  ? "#237447"
                  : "#b42318",
                marginBottom: "16px",
                fontSize: "14px",
              }}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "8px",
              background: "#237447",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Create Account
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "22px",
            color: "#647067",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/"
            style={{ color: "#237447", fontWeight: "bold" }}
          >
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
