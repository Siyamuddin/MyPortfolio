import { z } from "zod";

export const contactSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(2, "Enter at least 2 characters.")
    .max(100, "Use 100 characters or fewer."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(200, "Use 200 characters or fewer."),
  message: z
    .string()
    .trim()
    .min(10, "Tell me a little more (at least 10 characters).")
    .max(5000, "Use 5,000 characters or fewer."),
});
export type ContactFormValues = z.infer<typeof contactSchema>;
