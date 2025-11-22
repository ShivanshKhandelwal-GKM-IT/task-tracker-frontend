import '@testing-library/jest-dom';
import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../pages/register";
import { useAuth } from "../context/auth-context";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, test, expect, beforeEach } from "vitest";
import { toast } from "react-toastify";

vi.mock("../context/auth-context", () => ({
  useAuth: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Register Component", () => {
  const mockRegister = vi.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      register: mockRegister,
    });
    mockRegister.mockClear();
    vi.clearAllMocks();
  });

  test("calls register function with inputs", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password (min 6 characters)"), {
      target: { value: "secret123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: "John Doe", 
        email: "john@example.com", 
        password: "secret123"
      });
    });
  });
});