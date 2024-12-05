import { z, ZodType } from "zod";

interface SignupSchema {
    name: string;
    email: string;
    mobile: string;
    password: string;
    
  }

// const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{4,10}$/;

export const signupSchema: ZodType<SignupSchema> = z.object({
  name: z
    .string()
    .regex(/^[A-Za-z ]+$/, "Name should only contain alphabets and spaces")
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name must be less than 50 characters." })
    .refine((value) => value.trim() !== "", {
        message: "Name should not be empty",
      }
    ),
  
  email: z
    .string()
    .email({ message: "Invalid email address." }),
mobile: z
.string()
.min(10, { message: "Mobile number should be at least 10 digits" })
.max(15, { message: "Mobile number should not exceed 15 digits" })
.regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format" }),
  
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password must be less than 100 characters." }),

//   confirmPassword: z
//     .string()
//     .min(6, { message: "Password confirmation must be at least 6 characters long." })
//     .max(100, { message: "Password confirmation must be less than 100 characters." })
//     .refine((value) => passwordRegex.test(value), {
//         message: "Password should contain letters and numbers",
//       }),

// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords must match.",
//   path: ["confirmPassword"],
});
