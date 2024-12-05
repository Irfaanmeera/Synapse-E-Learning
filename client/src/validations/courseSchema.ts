// interface CourseSchema {
//   name: string;
//   description: string;
//   price: number;
//   category: string;
//   language: string;
//   level: string;
//   image: File;
// }

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

import { z, ZodType } from "zod";

export const courseSchema: ZodType = z.object({
  name: z
    .string()
    .min(5, "Name should be minimum 5 letters")
    .refine((value) => value.trim() !== "", {
      message: "Name should not be empty",
    })
    .transform((value) => value.trim()),
  description: z
    .string()
    .min(5, "Description should be minimum 5 letters")
    .refine((value) => value.trim() !== "", {
      message: "Description should not be empty",
    })
    .transform((value) => value.trim()),
  price: z.number().min(1, "Price should be greater than zero"),
  category: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Category should not be empty",
    })
    .transform((value) => value.trim()),
  language: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Language should not be empty",
    })
    .transform((value) => value.trim()),
  level: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Level should not be empty",
    })
    .transform((value) => value.trim()),
  image: z
    .any()
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});