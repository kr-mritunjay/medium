import { Hono } from "hono";
import userRoutes from "./routes/user";
import blogRoutes from "./routes/blog";
// import {}

const app = new Hono();

// app.use("/api/v1/blog/*", async (c, next) => {
//   try {
//     const header = c.req.header("Authorization") || "";

//     const response = await verify(header, c.env.JWT_TOKEN);
//     await next();
//   } catch (error) {
//     console.log("Error :", error);
//     return c.json({
//       error: "Unauthorized",
//     });
//   }
// });

app.route("/api/v1/user", userRoutes);
app.route("/api/v1/blog", blogRoutes);
// sing up part

// app.post("/api/v1/blog", (c) => {
//   return c.text("Hello Hono!");
// });
// app.put("/api/v1/blog", (c) => {
//   return c.text("Hello Hono!");
// });
// app.get("/api/v1/blog/:id", (c) => {
//   return c.text("Hello Hono!");
// });

export default app;
