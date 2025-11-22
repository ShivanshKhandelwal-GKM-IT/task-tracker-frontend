import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../pages/login";
import { useAuth } from "../context/auth-context";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, test, expect, beforeEach } from "vitest";
import { toast } from "react-toastify";
import '@testing-library/jest-dom';

vi.mock("../context/auth-context", () => ({ useAuth: vi.fn() }));
vi.mock("react-toastify", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe("Login Component", () => {
  const mockLogin = vi.fn();
  beforeEach(() => {
    useAuth.mockReturnValue({ login: mockLogin });
    vi.clearAllMocks();
  });

  test("renders correctly", () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
  });

  test("handles successful login", async () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@gmail.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "123789" } });
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(mockLogin).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalledWith("Welcome back!");
  });

  test("handles login failure (Error Branch)", async () => {
    
    mockLogin.mockRejectedValue({ response: { data: { message: "Invalid credentials" } } });

    render(<BrowserRouter><Login /></BrowserRouter>);
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@gmail.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
    });
  });
});