import { z, ZodType } from "zod";

// Define schema for updating user information
export const updateUserSchema: ZodType<{
  name: string;
  mobile: string;
}> = z.object({
  name: z
    .string()
    .regex(/^[A-Za-z ]+$/, "Name should only contain alphabets and spaces")
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name must be less than 50 characters." })
    .refine((value) => value.trim() !== "", {
      message: "Name should not be empty",
    }),
  mobile: z
    .string()
    .regex(/^[0-9]+$/, "Mobile number should only contain digits")
    .min(10, { message: "Mobile number must be exactly 10 digits." })
    .max(10, { message: "Mobile number must be exactly 10 digits." }),
});
