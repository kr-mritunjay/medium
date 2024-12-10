import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";

export const blogRoutes = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_TOKEN: string;
  };
  Variables: {
    UserId: string;
  };
}>();

// Authorization Middleware
blogRoutes.use("/", async (c, next) => {
  try {
    const header = c.req.header("Authorization");

    if (!header) {
      c.status(401);
      return c.json({ error: "No authorization token provided" });
    }

    const response = await verify(header, c.env.JWT_TOKEN);
    c.set("UserId", response.id);
    await next();
  } catch (error) {
    c.status(403);
    return c.json({
      error: "Invalid or expired token",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Create Post
blogRoutes.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const authId = c.get("UserId");

    // Validate input
    if (!body.title || !body.content) {
      c.status(400);
      return c.json({ error: "Title and content are required" });
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: authId,
      },
    });

    return c.json({
      msg: "Post created successfully",
      postId: post.id,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    c.status(500);
    return c.json({
      error: "Couldn't create post",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update Post
blogRoutes.put("/", async (c) => {
  try {
    const body = await c.req.json();
    const authId = c.get("UserId");

    // Validate input
    if (!body.id || !body.title || !body.content) {
      c.status(400);
      return c.json({ error: "Post ID, title, and content are required" });
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const updatedPost = await prisma.post.update({
      where: {
        id: body.id,
        authorId: authId, // Ensure user can only update their own posts
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.json({
      msg: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    c.status(500);
    return c.json({
      error: "Couldn't update post",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// get all post of the user
blogRoutes.get("/all", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const page = Number(c.req.query("page")) || 1;
    const limit = Number(c.req.query("limit")) || 10;
    const skip = (page - 1) * limit;

    const blogs = await prisma.post.findMany({
      take: limit,
      skip: skip,
      select: {
        id: true,
        title: true,
        // Add more fields as needed
      },
      orderBy: {
        // Add an ordering field if you have one, like createdAt
        // createdAt: 'desc'
      },
    });

    const totalCount = await prisma.post.count();

    return c.json({
      blogs,
      count: blogs.length,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return c.json(
      {
        error: "Couldn't load the content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

// Get Single Post

blogRoutes.get("/:id", async (c) => {
  try {
    const postId = c.req.param("id");

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!blog) {
      c.status(404);
      return c.json({ error: "Post not found" });
    }

    return c.json({ blog });
  } catch (error) {
    console.error("Error fetching post:", error);
    c.status(500);
    return c.json({
      error: "Couldn't fetch the post",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
