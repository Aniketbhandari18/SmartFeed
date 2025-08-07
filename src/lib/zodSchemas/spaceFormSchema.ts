import { z } from "zod";

export const spaceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters.")
    .max(30, "Name must be at most 30 characters."),

  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(30, "Title must be at most 30 characters."),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(500, "Description must be at most 500 characters."),

  externalLink: z.union([
    z.literal(""),
    z.url("Invalid URL format"),
  ]),
});
