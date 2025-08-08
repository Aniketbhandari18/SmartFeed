"use server";

import { getDbUserId } from "@/lib/getDbUserId";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteSpace = async (id: string) => {
  try {
    if (!id) {
      throw new Error("Space id is required");
    }

    const dbUserId = await getDbUserId();

    const space = await prisma.space.findUnique({
      where: {
        id,
      },
    });

    if (!space) {
      throw new Error("Space doesn't exist");
    }

    if (space.createdById !== dbUserId) {
      throw new Error("You are not authorized to delete this space");
    }

    try {
      await prisma.space.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error("Failed to delete space, Please try again.");
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Space deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};
