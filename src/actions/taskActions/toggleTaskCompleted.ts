"use server";

import { getDbUserId } from "@/lib/getDbUserId";
import prisma from "@/lib/prisma";

export const toggleTaskCompleted = async (
  spaceId: string,
  taskId: string,
  completed: boolean
) => {
  try {
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
    });

    if (!space) {
      throw new Error("Space doesn't exist");
    }

    const dbUserId = await getDbUserId();
    if (space.createdById !== dbUserId) {
      throw new Error("Unauthorized request");
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { completed },
    });

    console.log("updatedTask");
    console.log(updatedTask);

    return {
      success: true,
      message: "Task completed toggled successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error toggling",
    };
  }
};
