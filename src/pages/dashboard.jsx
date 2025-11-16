import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/auth-context";
import { toast } from "react-toastify";

export default function Dashboard() {
  const { logout } = useAuth();
  const [tasks, setTasks] = useState([]);

  const [showForm, setShowForm] = useState(false); 

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    status_id: 1,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.patch(`/api/tasks/${editId}`, formData);
        toast.success("Task updated successfully!");
        setIsEditing(false);
        setEditId(null);
      } else {
        await api.post("/api/tasks", formData);
        toast.success("Task added!");
      }

      setFormData({ title: "", description: "", deadline: "", status_id: 1 });
      setShowForm(false); 
      fetchTasks();
    } catch (err) {
      toast.error(isEditing ? "Failed to update" : "Failed to add task");
    }
  };

  const handleEditClick = (task) => {
    setIsEditing(true);
    setEditId(task.id);

    const formattedDate = task.deadline
      ? new Date(task.deadline).toISOString().split("T")[0]
      : "";

    setFormData({
      title: task.title,
      description: task.description,
      deadline: formattedDate,
      status_id: task.status_id,
    });

    setShowForm(true); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setShowForm(false); 
    setFormData({ title: "", description: "", deadline: "", status_id: 1 });
  };

  const handleComplete = async (id) => {
    try {
      await api.post(`/api/tasks/${id}/complete`);
      fetchTasks();
      toast.success("Task completed!");
    } catch (err) {
      toast.error("Error updating task. (Check DB status table)");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/api/tasks/${id}`);
      fetchTasks();
      toast.success("Task deleted");
    } catch (err) {
      toast.error("Error deleting task");
    }
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Task Manager</h1>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </header>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="add-task-btn"
          style={{
            marginBottom: "15px",
            padding: "10px 15px",
            fontSize: "16px",
            background: "#007bff",
            color: "#fff",
            borderRadius: "6px",
          }}
        >
          + Add Task
        </button>
      )}

      {showForm && (
        <section className="task-form">
          <h3>{isEditing ? "Edit Task" : "Add New Task"}</h3>
          <form onSubmit={handleSubmit}>
            <input
              name="title"
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <input
              name="description"
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />
            <input
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              required
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit">
                {isEditing ? "Save Changes" : "Add Task"}
              </button>

              <button
                type="button"
                onClick={handleCancelEdit}
                style={{ background: "#6c757d" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="task-list">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-card ${task.completed_at ? "completed" : ""}`}
          >
            <div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <small>
                Deadline: {new Date(task.deadline).toLocaleDateString()}
              </small>
            </div>

            <div className="actions">
              {!task.completed_at && (
                <>
                  <button
                    onClick={() => handleEditClick(task)}
                    style={{ background: "#ffc107", color: "#000" }}
                  >
                    ✎ Edit
                  </button>
                  <button
                    onClick={() => handleComplete(task.id)}
                    className="done-btn"
                  >
                    ✓ Done
                  </button>
                </>
              )}

              <button
                onClick={() => handleDelete(task.id)}
                className="delete-btn"
              >
                ✕ Delete
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
