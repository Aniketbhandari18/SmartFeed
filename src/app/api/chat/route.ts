import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { ApiError } from "@/lib/apiError";
import { generateEmbeddings } from "@/lib/server/generateEmbeddings";
import { qdrant } from "@/lib/qdrant";
import { getDbUserId } from "@/lib/getDbUserId";
import prisma from "@/lib/prisma";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

type Body = {
  messages: UIMessage[];
  spaceId?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body: Body = await req.json();
    const messages = body.messages;

    const lastMessage = messages[messages.length - 1].parts[0];

    let query: string | undefined;
    if (lastMessage.type === "text") {
      query = lastMessage.text;
    }

    if (!query) {
      throw new ApiError("Query is required", 400);
    }

    const spaceId = body.spaceId;
    if (!spaceId) {
      throw new ApiError("SpaceId is required", 400);
    }

    const dbuserId = await getDbUserId();
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
      select: { createdById: true },
    });

    if (!space) {
      throw new ApiError("Space doesn't exist", 400);
    }

    if (dbuserId !== space.createdById) {
      throw new ApiError("Unauthorized", 401);
    }

    // query embeddings required for similarity search
    const queryEmbeddings = await generateEmbeddings(query, "RETRIEVAL_QUERY");

    // similarity search
    const res = await qdrant.query("feedbacks", {
      query: queryEmbeddings,
      limit: 15,
      filter: {
        must: [
          {
            key: "spaceId",
            match: { value: spaceId },
          },
        ],
      },
      with_payload: {
        include: ["content"],
      },
    });

    // feedback context for text generation
    const feedbackContext = res.points
      .map((point) => `- ${point.payload?.content}`)
      .join("\n");

    const systemMessage = `
      You are SmartFeed AI Assistant.
      - If the user’s question is about feedbacks, use the provided feedback context and Keep responses short, clear, and conversational (4-5 sentences max or 5-6 bullet points, unless it requires more sentences) unless the user explicitly asks for a detailed report.
      - If the context is insufficient but the question is general (like greetings, small talk,capabilities, etc.), you can answer normally.
      - Always maintain continuity of conversation using the chat history.

      Here are relevant feedbacks:\n${feedbackContext}
    `;

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: systemMessage,
      messages: convertToModelMessages(messages),
      onError({ error }) {
        console.log(error);
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json({ message: "Error occurred" }, { status: 500 });
  }
}
