import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth-context";

export default function Register() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
  e.preventDefault();

  const name = formData.name.trim();
  const email = formData.email.trim().toLowerCase();
  const password = formData.password.trim();

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return toast.error("Invalid email format");
  }

  if (password.length < 6) {
    return toast.error("Password must be at least 6 characters");
  }

  try {
      await register(formData.name, formData.email, formData.password);
      toast.success("Account created!");
  } catch (err) {
    toast.error(err.response?.data?.message || "Registration failed");
  }
};


  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <p>Get started by creating your account.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button type="submit" className="btn-primary" style={{width: '100%'}}>Register</button>
      </form>
      <p className="auth-switch">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}