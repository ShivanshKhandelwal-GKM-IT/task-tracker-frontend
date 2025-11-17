import React from "react";

export default function TaskCard({ task, onEdit, onComplete, onDelete }) {
  const formattedDeadline = task.deadline
    ? new Date(task.deadline).toLocaleDateString()
    : null;

  const formattedCompletedDate = task.completed_at
    ? new Date(task.completed_at).toLocaleDateString()
    : null;

  return (
    <div className={`task-card ${task.completed_at ? "completed" : ""}`}>
      <div className="task-content">
        <h3>{task.title}</h3>
        <p>{task.description}</p>

        {formattedCompletedDate ? (
          <small style={{ color: "green" }}>
            Completed on: {formattedCompletedDate}
          </small>
        ) : (
          formattedDeadline && <small>Deadline: {formattedDeadline}</small>
        )}
      </div>

      <div className="task-actions">
        {!task.completed_at && (
          <>
            <button onClick={() => onEdit(task)} className="btn-edit">
              ✎ Edit
            </button>

            <button onClick={() => onComplete(task.id)} className="btn-done">
              ✓ Done
            </button>
          </>
        )}

        <button onClick={() => onDelete(task.id)} className="btn-delete">
          ✕ Delete
        </button>
      </div>
    </div>
  );
}