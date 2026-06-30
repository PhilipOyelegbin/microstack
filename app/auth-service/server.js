require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const argon = require("argon2");
const jwt = require("jsonwebtoken");

const app = express();
app.use(
  cors({
    origin: "http://localhost:8000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Sync Schema
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
  );
`);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await argon.hash(password);
  try {
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Username already exists" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  if (result.rows.length === 0)
    return res.status(401).json({ error: "Invalid email or password" });

  const user = result.rows[0];
  const valid = await argon.verify(user.password, password);
  if (!valid)
    return res.status(401).json({ error: "Invalid email or password" });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  res.json({ token });
});

app.get("/health", async (req, res) => {
  res.status(200).json({ status: "OK", uptime: process.uptime() });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, (err) => {
    if (err) {
      console.error("Error starting server:", err);
    } else {
      console.log(`Server running on port ${PORT}`);
    }
  });
}

module.exports = app;
