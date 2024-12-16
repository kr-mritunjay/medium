import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signupInput, signinInput } from "@mritunjaykr160/medium-common";

// creating object as well as the binding
export const userRoutes = new Hono<{
  Bindings: {
    // here i can give the types i want to give
    DATABASE_URL: string;
    JWT_TOKEN: string; // this is done to insure that databaseurl is string
  };
}>();

// signup part
userRoutes.post("/signup", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    // console.log(body);
    // const result = abc.parse(body);
    const { success } = signupInput.safeParse(body);
    console.log(success);
    // console.log(result);
    if (!success) {
      c.status(411);
      return c.json({
        msg: "wrong input",
      });
    }
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
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

userRoutes.post("/signin", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();

    const { success } = signinInput.safeParse(body);
    console.log(success);
    // console.log(result);
    if (!success) {
      c.status(411);
      return c.json({
        msg: "wrong input",
      });
    }
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

// export default userRoutes;
