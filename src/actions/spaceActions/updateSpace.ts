"use server";

import { z } from "zod";
import { getDbUserId } from "@/lib/getDbUserId";
import { generateUniqueSlug } from "@/utils/generateUniqueSlug";
import prisma from "@/lib/prisma";
import { spaceFormSchema } from "@/lib/zodSchemas/spaceFormSchema";
import { revalidatePath } from "next/cache";

export const updateSpace = async (
  id: string,
  values: z.infer<typeof spaceFormSchema>
) => {
  try {
    const result = spaceFormSchema.safeParse(values);

    if (!result.success) {
      throw new Error(result.error.issues[0].message);
    }

    const dbUserId = await getDbUserId();

    const existingSpace = await prisma.space.findUnique({
      where: {
        id,
      },
    });

    if (!existingSpace) {
      throw new Error("Space doesn't exist");
    }

    if (existingSpace.createdById !== dbUserId) {
      throw new Error("You are not authorized to edit this space");
    }

    let slug = existingSpace.slug;
    if (values.name !== existingSpace.name) {
      slug = await generateUniqueSlug(values.name);
    }
    
    let updatedSpace;
    try {
      updatedSpace = await prisma.space.update({
        where: { id },
        data: {
          name: values.name,
          slug: slug,
          title: values.title,
          description: values.description,
          externalLink: values.externalLink,
        },
      });
    } catch (error) {
      throw new Error("Failed to update space, Please try again.");
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Space updated successfully",
      updatedSpace 
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};
