import { z, ZodType } from "zod";

interface Login {
  email: string;
  password: string;
}

export const loginSchema: ZodType<Login> = z.object({
  email: z
    .string()
    .email()
    .refine((value) => value.trim() !== "", {
      message: "Email should not be empty",
    }),
  password: z.string().refine((value) => value.trim() !== "", {
    message: "Password should not be empty",
  }),
});