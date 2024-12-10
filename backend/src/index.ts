import { Hono } from "hono";
import { userRoutes } from "./routes/user";
import { blogRoutes } from "./routes/blog";
import { sign, verify } from "hono/jwt";

const app = new Hono();

app.route("/api/v1/user", userRoutes);
app.route("/api/v1/blog", blogRoutes);

export default app;
