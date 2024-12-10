import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";

export const blogRoutes = new Hono<{
  Bindings: {
    // here i can give the types i want to give
    DATABASE_URL: string;
    JWT_TOKEN: string; // this is done to insure that databaseurl is string
  };
}>();

// using middleware to authorize the routes

blogRoutes.use("/*", async (c, next) => {
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

// posting post

blogRoutes.post("/", async (c) => {
  try {
    const body = await c.req.json();

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: "1",
      },
    });

    return c.json({
      msg: "post was sucessfull",
    });
  } catch (error) {
    console.log("Error : ", error);
    c.json({
      error: "Coudn't post try again.....",
    });
  }
});

// updating post

blogRoutes.put("/", async (c) => {
  try {
    const body = await c.req.json();

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.json({
      msg: "post updated sucessfully",
    });
  } catch (error) {
    console.log("Error : ", error);
    c.json({
      error: "Coudn't update post try again.....",
    });
  }
});

// fetching post

blogRoutes.get("/", async (c) => {
  try {
    const body = await c.req.json();

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.post.findFirst({
      where: {
        id: body.id,
      },
    });

    return c.json({
      blog,
    });
  } catch (error) {
    console.log("Error : ", error);
    c.json({
      error: "Coudn't fetch the post try again.....",
    });
  }
});

blogRoutes.get("/bulk", async (c) => {
  try {
    const body = await c.req.json();

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blogs = await prisma.post.findMany();

    console.log(blogs);
  } catch (error) {
    console.log(error);
    return c.json({
      error: "Coudn't load the content....",
    });
  }
});
