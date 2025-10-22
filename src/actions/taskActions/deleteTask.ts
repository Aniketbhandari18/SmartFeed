"use server";

import { getDbUserId } from "@/lib/getDbUserId";
import prisma from "@/lib/prisma";

export async function deleteTask(taskId: string) {
  try {
    if (!taskId.trim()) {
      throw new Error("Task id is required");
    }

    const dbUserId = await getDbUserId();

    try {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { space: true },
      });

      if (!task) {
        throw new Error("Task doesn't exist");
      }

      if (task.space.createdById !== dbUserId) {
        throw new Error("You are not authorized to delete this task");
      }

      await prisma.task.delete({
        where: { id: taskId },
      });
    } catch (error) {
      throw new Error("Failed to delete task");
    }

    return {
      success: true,
      message: "Task deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete task",
    };
  }
}
