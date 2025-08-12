"use server";

import { gemini } from "../gemini";

type taskType = "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY";

export async function generateEmbeddings(
  text: string,
  taskType: taskType = "RETRIEVAL_DOCUMENT",
  title?: string
) {
  try {
    const response = await gemini.models.embedContent({
      model: "gemini-embedding-001",
      contents: {
        role: "user",
        parts: [{ text }],
      },
      config: {
        taskType: taskType,
        title,
      },
    });

    return response.embeddings?.[0].values ?? [];
  } catch (error) {
    throw new Error("Error generating embeddings");
  }
}
