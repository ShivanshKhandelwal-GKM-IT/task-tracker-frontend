import '@testing-library/jest-dom';
import React from "react"
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import Dashboard from "../pages/dashboard";
import api from "../services/api";
import { useAuth } from "../context/auth-context";
import { vi, describe, test, expect, beforeEach } from "vitest";

vi.mock("../services/api");
vi.mock("../context/auth-context");

if (typeof window !== 'undefined') {
    if (typeof window.scrollTo === 'undefined') {
        window.scrollTo = vi.fn();
    }
    if (typeof window.confirm === 'undefined') {
        window.confirm = vi.fn(() => true); 
    }
}
window.scrollTo = vi.fn();
window.confirm = vi.fn(() => true); 

describe("Dashboard Component", () => {
  const mockTasks = [
    { id: 1, title: "Task 1", description: "Desc 1", deadline: "2026-01-01", completed_at: null },
    { id: 2, title: "Task 2", description: "Desc 2", deadline: "2026-01-02", completed_at: "2025-01-01" },
  ];

  beforeEach(() => {
    useAuth.mockReturnValue({ logout: vi.fn() });
    api.get.mockResolvedValue({ data: mockTasks });
    api.post.mockResolvedValue({ data: {} });
    api.delete.mockResolvedValue({ data: {} });
    api.patch.mockResolvedValue({ data: {} });
    vi.clearAllMocks();
  });

  test("renders tasks", async () => {
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText("Task 1")).toBeInTheDocument());
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  test("adds a new task", async () => {
    render(<Dashboard />);
    await waitFor(() => screen.getByText("Task 1"));

    fireEvent.click(screen.getByText("+ Add Task"));
    fireEvent.change(screen.getByPlaceholderText("Title"), { target: { value: "New Task" } });
    fireEvent.change(screen.getByPlaceholderText("Description"), { target: { value: "New Desc" } });
    
    const dateInput = screen.getByDisplayValue(""); 
    fireEvent.change(dateInput, { target: { value: "2026-12-31" } });

    fireEvent.click(screen.getByText("Add Task"));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/tasks", expect.objectContaining({ title: "New Task" }));
    });
  });

  test("completes a task", async () => {
    render(<Dashboard />);
    await waitFor(() => screen.getByText("Task 1"));

    const doneBtn = screen.getByText("✓ Done");
    fireEvent.click(doneBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/tasks/1/complete");
    });
  });

  test("deletes a task", async () => {
    render(<Dashboard />);
    await waitFor(() => screen.getByText("Task 1"));

    const deleteBtns = screen.getAllByText("✕ Delete");
    fireEvent.click(deleteBtns[0]);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith("/api/tasks/1");
    });
  });

  test("edits a task", async () => {
    render(<Dashboard />);
    await waitFor(() => screen.getByText("Task 1"));

    fireEvent.click(screen.getByText("✎ Edit"));
    
    const titleInput = screen.getByDisplayValue("Task 1");
    expect(titleInput).toBeInTheDocument();

    fireEvent.change(titleInput, { target: { value: "Updated Task" } });
    
    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(api.patch).toHaveBeenCalledWith("/api/tasks/1", expect.objectContaining({ title: "Updated Task" }));
    });
  });
});