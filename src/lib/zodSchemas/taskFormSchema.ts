import { Priority, TaskCategory } from "@prisma/client";
import { z } from "zod";

export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name must be at most 30 characters."),

  description: z.union([
    z.literal(""),
    z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters.")
      .max(300, "Description must be at most 300 characters."),
  ]),

  priority: z.enum(Priority, "Priority is required"),

  category: z.enum(TaskCategory, "Category is required"),
});
