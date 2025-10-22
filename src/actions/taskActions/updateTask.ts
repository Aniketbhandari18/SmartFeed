"use server";

import { z } from "zod";
import { taskFormSchema } from "@/lib/zodSchemas/taskFormSchema";
import { getDbUserId } from "@/lib/getDbUserId";
import prisma from "@/lib/prisma";

export async function updateTask(
  taskId: string,
  values: z.infer<typeof taskFormSchema>
) {
  try {
    const validation = taskFormSchema.safeParse(values);

    if (!validation.success) {
      throw new Error(validation.error.issues[0].message);
    }

    const dbUserId = await getDbUserId();

    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { space: true },
      });

      if (!task) {
        throw new Error("Task not found");
      }

      if (task.space.createdById !== dbUserId) {
        throw new Error("You are not authorized to update this task");
      }

      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          ...validation.data,
        },
      });

      return {
        success: true,
        message: "Task updated successfully",
        newTask: updatedTask,
      };
    } catch (error) {
      console.log(error);
      throw new Error("Failed to update task");
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update task",
    };
  }
}
