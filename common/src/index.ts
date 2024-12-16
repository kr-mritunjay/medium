import z from "zod";

export const signupInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

// type infer in zod for frontend for sing up input validation
export type SignupInput = z.infer<typeof signupInput>;

export const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// type infer in zod for frontend for sing ip input validation
export type SigninInput = z.infer<typeof signinInput>;

export const createBlog = z.object({
  title: z.string(),
  content: z.string(),
});

export type CreateBlog = z.infer<typeof createBlog>;

export const updateBlog = z.object({
  tile: z.string(),
  content: z.string(),
  id: z.string(),
});

export type UpdateBlog = z.infer<typeof updateBlog>;
