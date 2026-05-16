const express = require("express");
const app = express();
 
app.use(express.json());
 
// In-memory store (no DB needed)
let todos = [];
let nextId = 1;
 
// Health check — GitHub Actions uses this to verify the app is alive
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
 
// Get all todos
app.get("/todos", (req, res) => {
  res.json({ todos, count: todos.length });
});
 
// Get one todo
app.get("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ error: "Todo not found" });
  res.json(todo);
});
 
// Create a todo
app.post("/todos", (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }
  const todo = {
    id: nextId++,
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  res.status(201).json(todo);
});
 
// Update a todo
app.patch("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ error: "Todo not found" });
  if (typeof req.body.completed === "boolean") todo.completed = req.body.completed;
  if (req.body.title && req.body.title.trim() !== "") todo.title = req.body.title.trim();
  res.json(todo);
});
 
// Delete a todo
app.delete("/todos/:id", (req, res) => {
  const index = todos.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Todo not found" });
  todos.splice(index, 1);
  res.json({ message: "Deleted successfully" });
});
 
// Reset store (used in tests)
app.delete("/todos", (req, res) => {
  todos = [];
  nextId = 1;
  res.json({ message: "All todos cleared" });
});
 
module.exports = app;
 
