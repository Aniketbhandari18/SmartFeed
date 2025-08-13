import { z } from "zod";

export const feedbackFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters.")
    .max(30, "Name must be at most 30 characters."),

  email: z.email("Invalid email"),

  content: z
    .string()
    .trim()
    .min(3, "Feedback content must be at least 3 characters.")
    .max(1000, "Feedback content must be at most 1000 characters."),
});
