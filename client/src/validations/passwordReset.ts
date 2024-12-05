import { z, ZodType } from "zod";

interface ChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmpassword: string;
}

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{4,10}$/;

export const changePasswordSchema: ZodType<ChangePassword> = z
  .object({
    currentPassword: z.string().refine((value) => value.trim() !== "", {
      message: "Password should not be empty",
    }),
    newPassword: z
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
  .refine((data) => data.newPassword === data.confirmpassword, {
    message: "Password does not match",
    path: ["confirmpassword"],
  });