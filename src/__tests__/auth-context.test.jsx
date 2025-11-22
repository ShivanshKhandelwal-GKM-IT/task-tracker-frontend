import '@testing-library/jest-dom';
import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../context/auth-context";
import api from "../services/api";
import { vi, describe, test, expect, beforeEach } from "vitest";

const mockedNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockedNavigate,
}));

vi.mock("../services/api");

const store = {}; 
global.localStorage = {
  getItem: vi.fn((key) => store[key] || null),
  setItem: vi.fn((key, value) => {
    store[key] = value;
  }),
  removeItem: vi.fn((key) => {
    delete store[key];
  }),
  clear: vi.fn(() => {
    for (const key in store) {
      delete store[key];
    }
  }),
};

const TestComponent = () => {
  const { login, register, logout, token, user } = useAuth();
  return (
    <div>
      <div data-testid="token">{token}</div>
      <div data-testid="user">{user?.name}</div>
      <button onClick={() => login({ email: "test@test.com", password: "pass" })}>Login</button>
      <button onClick={() => register({ name: "Name", email: "email@test.com", password: "pass" })}>Register</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.localStorage.clear();
  });

  test("login sets token and redirects", async () => {
    api.post.mockResolvedValue({ data: { token: "abc", user: { name: "User" } } });
    render(<AuthProvider><TestComponent /></AuthProvider>);

    await fireEvent.click(screen.getByText("Login"));
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/auth/login", {
          email: "test@test.com", password: "pass"
      });
      expect(mockedNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("register sets token and redirects", async () => {
    api.post.mockResolvedValue({ data: { token: "xyz", user: { name: "New" } } });
    render(<AuthProvider><TestComponent /></AuthProvider>);

    await fireEvent.click(screen.getByText("Register"));
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/auth/register", {
        name: "Name", email: "email@test.com", password: "pass"
      });
      expect(mockedNavigate).toHaveBeenCalledWith("/login"); 
    });
  });

  test("logout clears token and redirects", async () => {
    global.localStorage.setItem("token", "old-token"); 
    render(<AuthProvider><TestComponent /></AuthProvider>);

    await fireEvent.click(screen.getByText("Logout"));
    
    expect(api.post).toHaveBeenCalledWith("/api/auth/logout");
    expect(mockedNavigate).toHaveBeenCalledWith("/login");
  });
});