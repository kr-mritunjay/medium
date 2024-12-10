import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
// import {}

const app = new Hono<{
  Bindings: {
    // here i can give the types i want to give
    DATABASE_URL: string;
    JWT_TOKEN: string; // this is done to insure that databaseurl is string
  };
}>();

app.use("/api/v1/blog/*", async (c, next) => {
  try {
    const header = c.req.header("Authorization") || "";

    const response = await verify(header, c.env.JWT_TOKEN);
    await next();
  } catch (error) {
    console.log("Error :", error);
    return c.json({
      error: "Unauthorized",
    });
  }
});

// sing up part

app.post("/api/v1/signup", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });
    console.log(c.env.JWT_TOKEN);
    const token = await sign({ id: user.id }, c.env.JWT_TOKEN);

    return c.json({
      jwt: token,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// singin part

app.post("/api/v1/signin", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      c.status(403);
      return c.json({ error: "user not found" });
    }

    const token = await sign({ id: user.id }, c.env.JWT_TOKEN);
    return c.json({
      jwt: token,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

app.post("/api/v1/blog", (c) => {
  return c.text("Hello Hono!");
});
app.put("/api/v1/blog", (c) => {
  return c.text("Hello Hono!");
});
app.get("/api/v1/blog/:id", (c) => {
  return c.text("Hello Hono!");
});

export default app;
