const { z } = require("zod");

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email format" }),
  password: z.string(),
});

const login = (req, res, next) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    const formatted = result.error.flatten();
    return res.status(400).json({
      message: "Invalid data",
      errors: formatted.fieldErrors,
    });
  }

  req.body = result.data;
  next();
};

const signupSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email({ message: "Invalid email format" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirm: z.string(),
    name: z.string().trim().min(1, "Name is required"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

const signup = (req, res, next) => {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    const formatted = result.error.flatten();
    return res.status(400).json({
      message: "Invalid data",
      errors: formatted.fieldErrors,
    });
  }

  req.body = result.data;
  next();
};

module.exports = { login, signup };
