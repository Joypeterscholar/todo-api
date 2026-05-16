const request = require("supertest");
const app = require("../src/app");
 
beforeEach(async () => {
  await request(app).delete("/todos");
});
 
// ─── HEALTH ────────────────────────────────────────────
describe("GET /health", () => {
  test("returns status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.timestamp).toBeDefined();
  });
});
 
// ─── GET ALL TODOS ─────────────────────────────────────
describe("GET /todos", () => {
  test("returns empty list initially", async () => {
    const res = await request(app).get("/todos");
    expect(res.status).toBe(200);
    expect(res.body.todos).toEqual([]);
    expect(res.body.count).toBe(0);
  });
 
  test("returns all created todos", async () => {
    await request(app).post("/todos").send({ title: "Buy milk" });
    await request(app).post("/todos").send({ title: "Walk dog" });
    const res = await request(app).get("/todos");
    expect(res.body.count).toBe(2);
  });
});
 
// ─── CREATE TODO ───────────────────────────────────────
describe("POST /todos", () => {
  test("creates a todo successfully", async () => {
    const res = await request(app).post("/todos").send({ title: "Learn GitHub Actions" });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Learn GitHub Actions");
    expect(res.body.completed).toBe(false);
    expect(res.body.id).toBeDefined();
  });
 
  test("trims whitespace from title", async () => {
    const res = await request(app).post("/todos").send({ title: "  Trimmed  " });
    expect(res.body.title).toBe("Trimmed");
  });
 
  test("rejects empty title", async () => {
    const res = await request(app).post("/todos").send({ title: "" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Title is required");
  });
 
  test("rejects missing title", async () => {
    const res = await request(app).post("/todos").send({});
    expect(res.status).toBe(400);
  });
});
 
// ─── GET ONE TODO ──────────────────────────────────────
describe("GET /todos/:id", () => {
  test("returns the correct todo", async () => {
    const created = await request(app).post("/todos").send({ title: "Read a book" });
    const res = await request(app).get(`/todos/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Read a book");
  });
 
  test("returns 404 for missing todo", async () => {
    const res = await request(app).get("/todos/9999");
    expect(res.status).toBe(404);
  });
});
 
// ─── UPDATE TODO ───────────────────────────────────────
describe("PATCH /todos/:id", () => {
  test("marks todo as completed", async () => {
    const created = await request(app).post("/todos").send({ title: "Exercise" });
    const res = await request(app)
      .patch(`/todos/${created.body.id}`)
      .send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });
 
  test("updates the title", async () => {
    const created = await request(app).post("/todos").send({ title: "Old title" });
    const res = await request(app)
      .patch(`/todos/${created.body.id}`)
      .send({ title: "New title" });
    expect(res.body.title).toBe("New title");
  });
 
  test("returns 404 for missing todo", async () => {
    const res = await request(app).patch("/todos/9999").send({ completed: true });
    expect(res.status).toBe(404);
  });
});
 
// ─── DELETE TODO ───────────────────────────────────────
describe("DELETE /todos/:id", () => {
  test("deletes a todo", async () => {
    const created = await request(app).post("/todos").send({ title: "Delete me" });
    const res = await request(app).delete(`/todos/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Deleted successfully");
  });
 
  test("todo is gone after delete", async () => {
    const created = await request(app).post("/todos").send({ title: "Gone soon" });
    await request(app).delete(`/todos/${created.body.id}`);
    const res = await request(app).get(`/todos/${created.body.id}`);
    expect(res.status).toBe(404);
  });
 
  test("returns 404 for missing todo", async () => {
    const res = await request(app).delete("/todos/9999");
    expect(res.status).toBe(404);
  });
});
 
