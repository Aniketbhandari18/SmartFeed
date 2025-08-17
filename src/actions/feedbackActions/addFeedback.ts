"use server";

import prisma from "@/lib/prisma";
import { feedbackFormSchema } from "@/lib/zodSchemas/feedbackFormSchema";
import { z } from "zod";
import { qdrant } from "@/lib/qdrant";
import { generateEmbeddings } from "@/lib/server/generateEmbeddings";
import { classifyFeedback } from "@/lib/server/classifyFeedback";

export const addFeedback = async (
  slug: string,
  values: z.infer<typeof feedbackFormSchema>
) => {
  try {
    if (!slug) {
      throw new Error("Slug is required");
    }

    const result = feedbackFormSchema.safeParse(values);

    if (!result.success) {
      throw new Error(result.error?.issues[0].message);
    }

    const [classification, embeddings] = await Promise.all([
      classifyFeedback(values.content),
      generateEmbeddings(values.content, "RETRIEVAL_DOCUMENT", "feedback"),
    ]);

    if (!embeddings.length) {
      throw new Error("Error generating embeddings");
    }

    const { sentiment, category } = classification;

    try {
      const space = await prisma.space.findUnique({
        where: { slug },
      });
      if (!space) {
        throw new Error("Space doesn't exist");
      }

      const feedback = await prisma.feedback.create({
        data: {
          spaceId: space.id,
          content: values.content,
          userName: values.name,
          userEmail: values.email,
          category: category,
          sentiment: sentiment,
        },
      });

      await qdrant.upsert("feedbacks", {
        wait: true,
        points: [
          {
            id: feedback.id,
            payload: feedback,
            vector: embeddings,
          },
        ],
      });
    } catch (error) {
      console.log("Error:", error);
      throw new Error("Error adding feedback");
    }

    return {
      success: true,
      message: "Feedback added successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error adding feedback",
    };
  }
};
