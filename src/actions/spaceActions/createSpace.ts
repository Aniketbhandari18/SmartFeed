"use server";

import { z } from "zod";
import { getDbUserId } from "@/lib/getDbUserId";
import { generateUniqueSlug } from "@/utils/generateUniqueSlug";
import prisma from "@/lib/prisma";
import { spaceFormSchema } from "@/lib/zodSchemas/spaceFormSchema";
import { revalidatePath } from "next/cache";

export const createSpace = async (values: z.infer<typeof spaceFormSchema>) => {
  try {
    const result = spaceFormSchema.safeParse(values);

    if (!result.success) {
      throw new Error(result.error.issues[0].message);
    }

    const dbUserId = await getDbUserId();

    const slug = await generateUniqueSlug(values.name);

    try {
      await prisma.space.create({
        data: {
          name: values.name,
          slug: slug,
          title: values.title,
          description: values.description,
          externalLink: values.externalLink,
          createdById: dbUserId,
        },
      });
    } catch (error) {
      throw new Error("Failed to create space, Please try again.");
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Space created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};
