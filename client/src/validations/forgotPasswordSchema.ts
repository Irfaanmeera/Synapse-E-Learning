import { z, ZodType } from "zod";

interface ChangePassword {
  password: string;
  confirmpassword: string;
}

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{4,10}$/;

export const forgotPasswordSchema: ZodType<ChangePassword> = z
  .object({
    password: z
      .string()
      .min(4)
      .refine((value) => passwordRegex.test(value), {
        message: "Password should contain letters and numbers",
      }),
    confirmpassword: z
      .string()
      .min(4)
      .refine((value) => passwordRegex.test(value), {
        message: "Password should contain letters and numbers",
      }),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Password does not match",
    path: ["confirmpassword"],
  });