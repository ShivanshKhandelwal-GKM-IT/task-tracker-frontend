import React from "react"
import { render, screen, fireEvent } from "@testing-library/react";
import TaskCard from "../components/taskcard"; 
import { vi, describe, test, expect } from "vitest";
import '@testing-library/jest-dom';

describe("TaskCard Component", () => {
  const mockHandlers = { onEdit: vi.fn(), onComplete: vi.fn(), onDelete: vi.fn() };
  const pendingTask = { id: 1, title: "T1", description: "D1", deadline: "2026-01-01", completed_at: null };
  const completedTask = { id: 2, title: "T2", description: "D2", deadline: "2026-01-01", completed_at: "2026-01-02" };

  test("renders pending task actions", () => {
    render(<TaskCard task={pendingTask} {...mockHandlers} />);
    expect(screen.getByText("✎ Edit")).toBeInTheDocument();
    expect(screen.getByText("✓ Done")).toBeInTheDocument();
  });

  test("renders completed task actions", () => {
    render(<TaskCard task={completedTask} {...mockHandlers} />);
    expect(screen.queryByText("✎ Edit")).not.toBeInTheDocument();
    expect(screen.getByText("✕ Delete")).toBeInTheDocument();
  });

  test("triggers actions", () => {
    render(<TaskCard task={pendingTask} {...mockHandlers} />);
    
    fireEvent.click(screen.getByText("✎ Edit"));
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(pendingTask);

    fireEvent.click(screen.getByText("✓ Done"));
    expect(mockHandlers.onComplete).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByText("✕ Delete"));
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(1);
  });
});