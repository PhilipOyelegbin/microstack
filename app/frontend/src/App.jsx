import { useState, useEffect } from "react";

function App() {
  // Authentication & View States
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [view, setView] = useState(token ? "notes" : "login"); // views: 'login', 'register', 'notes'

  // Form Fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Data State
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");

  const AUTH_URL = import.meta.env.VITE_APP_AUTH_URL;
  const GIN_URL = import.meta.env.VITE_APP_GIN_URL;

  // Fetch notes automatically when the user is logged in
  useEffect(() => {
    if (token && view === "notes") {
      fetch(`${GIN_URL}/notes`)
        .then((res) => res.json())
        .then((data) => setNotes(Array.isArray(data) ? data : []))
        .catch((err) => console.error("Failed to load notes:", err));
    }
  }, [token, view, GIN_URL]);

  const handleAuth = (e, endpoint) => {
    e.preventDefault();
    setError("");

    fetch(`${AUTH_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Authentication failed");
        return data;
      })
      .then((data) => {
        if (endpoint === "login") {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          setView("notes");
          setUsername("");
          setPassword("");
        } else {
          // Registration successful -> redirect to login stage
          alert("Registration successful! Please login.");
          setView("login");
          setPassword("");
        }
      })
      .catch((err) => setError(err.message));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setNotes([]);
    setView("login");
  };

  const handleCreateNote = (e) => {
    e.preventDefault();
    fetch(`${GIN_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    })
      .then((res) => res.json())
      .then((newNote) => setNotes([newNote, ...notes]))
      .catch((err) => console.error(err));

    setTitle("");
    setContent("");
  };

  // --- Auth View Layout Templates (Login & Registration) ---
  if (view === "login" || view === "register") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f5f5f5",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <h2>{view === "login" ? "Login to NoteApp" : "Create an Account"}</h2>

          {error && (
            <div
              style={{ color: "red", marginBottom: "15px", fontSize: "14px" }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={(e) =>
              handleAuth(e, view === "login" ? "login" : "register")
            }
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              style={{
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={{
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "12px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {view === "login" ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <p
            style={{
              marginTop: "20px",
              textAlign: "center",
              fontSize: "14px",
              color: "#666",
            }}
          >
            {view === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <span
              onClick={() => {
                setView(view === "login" ? "register" : "login");
                setError("");
              }}
              style={{
                color: "#007bff",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {view === "login" ? "Register here" : "Login here"}
            </span>
          </p>
        </div>
      </div>
    );
  }

  // --- Notes Workspace Template ---
  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee",
          paddingBottom: "10px",
          marginBottom: "20px",
        }}
      >
        <h1>My Personal Workspace</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleCreateNote}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "6px",
          border: "1px solid #eef",
        }}
      >
        <h3>Create a New Note</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
          required
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your ideas here..."
          required
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            height: "100px",
            resize: "vertical",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Save Secure Note
        </button>
      </form>

      <div
        style={{
          marginTop: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        {notes.length === 0 ? (
          <p style={{ color: "#888", gridColumn: "1/-1", textAlign: "center" }}>
            No notes captured yet. Add your first note above!
          </p>
        ) : null}
        {notes.map((note) => (
          <div
            key={note.id}
            style={{
              border: "1px solid #e0e0e0",
              padding: "15px",
              borderRadius: "6px",
              background: "white",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
              position: "relative",
            }}
          >
            <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>
              {note.title}
            </h4>
            <p style={{ color: "#555", fontSize: "15px", lineHeight: "1.4" }}>
              {note.content}
            </p>
            {note.summary && (
              <div
                style={{
                  marginTop: "12px",
                  paddingTop: "8px",
                  borderTop: "1px dashed #eee",
                  color: "#666",
                  fontSize: "13px",
                  background: "#fdfdfd",
                }}
              >
                <strong>AI Summary:</strong> {note.summary}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
