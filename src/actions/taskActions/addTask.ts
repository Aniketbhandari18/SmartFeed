"use server";

import prisma from "@/lib/prisma";
import { taskFormSchema } from "@/lib/zodSchemas/taskFormSchema";
import { z } from "zod";

export async function addTask(
  spaceId: string,
  values: z.infer<typeof taskFormSchema>
) {
  try {
    if (!spaceId) {
      throw new Error("SpaceId is required");
    }

    const validation = taskFormSchema.safeParse(values);

    if (!validation.success) {
      throw new Error(validation.error.issues[0].message);
    }

    const newTask = await prisma.task.create({
      data: {
        spaceId: spaceId,
        completed: false,
        ...validation.data,
      },
    });

    return {
      success: true,
      message: "Task added successfully",
      newTask: newTask,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error adding task",
    };
  }
}
